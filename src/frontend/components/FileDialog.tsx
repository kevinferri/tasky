import * as React from 'react';
import styled from 'styled-components';

import { IFile } from '../interfaces';

interface Props {
  file: IFile | null;
}

const renderAsset = (file: IFile): React.ReactNode => {
  if (file.resourceType === 'pdf') {
    return <iframe src={file.secureUrl} />;
  }

  if (file.resourceType === 'video') {
    return <video controls src={file.secureUrl} />;
  }

  if (file.resourceType === 'image') {
    return <img src={file.secureUrl} />;
  }
};

export const FileDialog = ({ file }: Props) => {
  if (!file) {
    return null;
  }

  return <Asset>{renderAsset(file)}</Asset>;
};

const Asset = styled.div`
  video,
  iframe {
    max-height: 700px;
    width: 100%;
  }

  img {
    display: block;
    margin: 0 auto;
    max-height: 700px;
    max-width: 100%;
  }

  iframe {
    height: 700px;
  }
`;
