import * as React from 'react';
import styled from 'styled-components';
import { Intent, Spinner } from '@blueprintjs/core';

export const Loader = () => {
  return <StyledSpinner intent={Intent.PRIMARY} />;
};

const StyledSpinner = styled(Spinner)`
  margin-top: 20px;
`;
