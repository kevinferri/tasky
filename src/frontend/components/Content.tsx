import * as React from 'react';
import styled from 'styled-components';

export const Content = (props: { children: React.ReactNode }) => {
  return <StyledContent>{props.children}</StyledContent>;
};

const StyledContent = styled.div`
  padding: 10px 40px;
  position: relative;
`;
