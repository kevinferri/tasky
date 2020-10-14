import * as React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FileInput, Intent, Spinner, Toast, Toaster } from '@blueprintjs/core';

import { useGet, cache } from '../hooks/useApiResource';
import { Content } from '../components/Content';
import { FileTable } from '../components/FileTable';
import { Loader } from '../components/Loader';
import { Error } from '../components/Error';
import { IFile } from '../interfaces';
import { FILES_ENDPOINT, FILES_FIELDS } from '../constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Files = () => {
  const { data, isLoading, error } = useGet<IFile[]>(
    `${FILES_ENDPOINT}?fields=${FILES_FIELDS}`,
    FILES_ENDPOINT,
  );
  const [uploadingFile, setUploadingFile] = React.useState<File | null>(null);
  const prevCache: IFile[] = cache.get(FILES_ENDPOINT);

  useDocumentTitle('Files');

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
        <FileTable files={data} />
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
