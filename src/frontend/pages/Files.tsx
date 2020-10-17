import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Button,
  FileInput,
  Intent,
  HTMLSelect,
  Spinner,
  Toast,
  Toaster,
} from '@blueprintjs/core';

import { useGet, cache } from '../hooks/useApiResource';
import { Content } from '../components/Content';
import { FilesTable } from '../components/FilesTable';
import { Loader } from '../components/Loader';
import { Error } from '../components/Error';
import { IFile } from '../interfaces';
import { FILES_ENDPOINT, FILES_QUERY_PARAMS } from '../constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useDidMountEffect } from '../hooks/useDidMountEffect';

interface Props {
  sortDirection: string;
  sortField: string;
  setSortDirection: Dispatch<SetStateAction<string>>;
  setSortField: Dispatch<SetStateAction<string>>;
}

export const Files = ({
  sortDirection,
  sortField,
  setSortDirection,
  setSortField,
}: Props) => {
  const BASE_REQUEST_URL = `${FILES_ENDPOINT}${FILES_QUERY_PARAMS}`;
  const [uploadingFile, setUploadingFile] = React.useState<File | null>(null);
  const prevCache: IFile[] = cache.get(FILES_ENDPOINT);
  const { data, isLoading, error } = useGet<IFile[]>(
    `${BASE_REQUEST_URL}&sort=${sortDirection}${sortField}`,
    FILES_ENDPOINT,
  );

  useDocumentTitle('Files');

  useDidMountEffect(async () => {
    const { data } = await axios.get(
      `${BASE_REQUEST_URL}&sort=${sortDirection}${sortField}`,
    );
    cache.set(FILES_ENDPOINT, data);
  }, [sortField, sortDirection]);

  if (isLoading && !data) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div>
      {uploadingFile !== null && (
        <Toaster>
          <Toast
            intent={Intent.PRIMARY}
            icon="cloud-upload"
            message={
              <div>
                <span>
                  Uploading <b>{uploadingFile.name}</b>
                </span>
                <UploadSpinner size={Spinner.SIZE_SMALL} />
              </div>
            }
          />
        </Toaster>
      )}
      <Content>
        <h1>Files</h1>
        <UploadArea>
          <FileInput
            text="Choose file"
            onInputChange={(event) => {
              const target = event.target as HTMLInputElement;
              const file = target.files[0];

              if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                setUploadingFile(file);

                reader.onload = async (event) => {
                  const { data } = await axios.post(FILES_ENDPOINT, {
                    file: event.target.result,
                    fileName: file.name,
                  });
                  setUploadingFile(null);
                  cache.set(FILES_ENDPOINT, [data, ...prevCache]);
                };
              }
            }}
          />
        </UploadArea>
        <Sorter>
          <h4>Sort: </h4>
          <HTMLSelect
            minimal
            value={sortField}
            options={[
              {
                value: 'createdAt',
                label: 'Uploaded on',
              },
              {
                value: 'fileName',
                label: 'Name',
              },
              {
                value: 'resourceType',
                label: 'Type',
              },
              {
                value: 'fileSize',
                label: 'Size',
              },
            ]}
            onChange={async (event) => {
              setSortField(event.target.value);
            }}
          />
          <Button
            minimal
            icon={sortDirection === '-' ? 'arrow-down' : 'arrow-up'}
            onClick={() => {
              setSortDirection(sortDirection === '-' ? '' : '-');
            }}
          />
        </Sorter>
        <FilesTable files={data} />
      </Content>
    </div>
  );
};

const UploadArea = styled.div`
  margin-bottom: 20px;
`;

const UploadSpinner = styled(Spinner)`
  display: inline-block;
  margin-left: 10px;

  .bp3-spinner-track {
    stroke: rgba(180, 180, 180, 0.8);
  }

  .bp3-spinner-head {
    stroke: white;
  }
`;

const Sorter = styled.div`
  h4 {
    margin-right: 5px;
  }

  align-items: center;
  display: flex;
  margin-bottom: 20px;
`;
