import * as React from 'react';
import { NonIdealState } from '@blueprintjs/core';

export const Error = () => {
  return (
    <NonIdealState
      icon="error"
      title="There was an error loading this page."
      description="Please refresh and try again."
    />
  );
};
