import * as React from 'react';
import styled from 'styled-components';

interface Props {
  src: string;
}

export const Avatar = ({ src }: Props) => {
  return <StyledAvatar src={src} />;
};

const StyledAvatar = styled.img`
  border-radius: 50%;
  height: 30px;
  width: 30px;
`;
