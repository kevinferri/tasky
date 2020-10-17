import * as React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  Button,
  ButtonGroup,
  Dialog,
  EditableText,
  Icon,
  IconName,
  Intent,
  NonIdealState,
  HTMLTable,
  Toast,
  Toaster,
} from '@blueprintjs/core';

import { cache } from '../hooks/useApiResource';
import { bytesToSize } from '../helpers/bytesToSize';
import { IFile } from '../interfaces';
import { FileDialog } from './FileDialog';
import { FILES_ENDPOINT } from '../constants';

interface Props {
  files: IFile[];
}

const renderPreview = (file: IFile): React.ReactNode => {
  const iconMap: { [x: string]: IconName } = {
    video: 'video',
    pdf: 'document',
    image: 'media',
  };

  if (file.resourceType === 'image') {
    return <Img src={file.secureUrl} />;
  }

  return (
    <PreviewIcon icon={iconMap[file.resourceType]} iconSize={Icon.SIZE_LARGE} />
  );
};

export const FilesTable = ({ files }: Props) => {
  const [openFileForDialog, setOpenFileForDialog] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState(null);
  const prevCache: IFile[] = cache.get(FILES_ENDPOINT);

  if (!files) {
    return null;
  }

  if (files.length === 0) {
    return (
      <StyledNonIdealState
        icon="error"
        title="You haven't uploaded any files yet."
      />
    );
  }

  return (
    <div>
      {toastMessage !== null && (
        <Toaster>
          <Toast
            icon="tick-circle"
            intent={Intent.SUCCESS}
            message={toastMessage}
            timeout={3000}
            onDismiss={() => {
              setToastMessage(null);
            }}
          />
        </Toaster>
      )}
      <StyledHTMLTable bordered>
        <tbody>
          {files.map((file) => {
            return (
              <tr key={file._id}>
                <td>{renderPreview(file)}</td>
                <td>
                  <EditableText
                    defaultValue={file.fileName}
                    onConfirm={(fileName) => {
                      if (fileName !== file.fileName) {
                        axios.patch(`${FILES_ENDPOINT}/${file._id}`, {
                          fileName,
                        });
                        cache.set(
                          FILES_ENDPOINT,
                          prevCache.map((savedFile) => {
                            if (savedFile._id === file._id) {
                              savedFile.fileName = fileName;
                            }

                            return savedFile;
                          }),
                        );
                      }
                    }}
                  />
                </td>
                <td>{bytesToSize(file.fileSize)}</td>
                <td>{file.resourceType}</td>
                <td>{new Date(file.createdAt).toLocaleDateString()}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      minimal
                      icon="eye-open"
                      onClick={() => {
                        setOpenFileForDialog(file);
                      }}
                    />
                    <a target="_blank" href={file.secureUrl}>
                      <Button minimal icon="link" />
                    </a>
                    <Button
                      minimal
                      icon="trash"
                      onClick={() => {
                        axios.delete(`${FILES_ENDPOINT}/${file._id}`);
                        setToastMessage(`Deleted ${file.fileName}`);
                        cache.set(
                          FILES_ENDPOINT,
                          prevCache.filter(
                            (savedFile) => savedFile._id !== file._id,
                          ),
                        );
                      }}
                    />
                  </ButtonGroup>
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledHTMLTable>
      <StyledDialog
        canOutsideClickClose
        canEscapeKeyClose
        title={openFileForDialog?.fileName}
        onClose={() => {
          setOpenFileForDialog(null);
        }}
        isOpen={openFileForDialog !== null}
      >
        <FileDialog file={openFileForDialog} />
      </StyledDialog>
    </div>
  );
};

const StyledNonIdealState = styled(NonIdealState)`
  height: auto;
`;

const StyledDialog = styled(Dialog)`
  padding-bottom: 0;
  width: 700px;
`;

const StyledHTMLTable = styled(HTMLTable)`
  tr:hover {
    background: #f5f8fc;
  }

  td {
    vertical-align: middle !important;
  }
`;

const PreviewIcon = styled(Icon)`
  color: rgba(0, 0, 0, 0.7);
`;

const Img = styled.img`
  border-radius: 2px;
  height: 24px;
  width: 24px;
`;
