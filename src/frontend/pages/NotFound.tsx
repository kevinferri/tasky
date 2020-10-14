import * as React from 'react';
import styled from 'styled-components';

import { NonIdealState } from '@blueprintjs/core';

export const NotFound = () => {
  return <StyledNonIdealState icon="error" title="404 Not found" />;
};

const StyledNonIdealState = styled(NonIdealState)`
  height: 400px;
`;
