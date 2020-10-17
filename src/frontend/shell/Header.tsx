import * as React from 'react';
import styled from 'styled-components';
import { Button, Menu, Popover, Position } from '@blueprintjs/core';

import { ViewerContext } from '../contexts/ViewerContext';
import { Avatar } from '../components/Avatar';

export const Header = () => {
  const viewer = React.useContext(ViewerContext);

  return (
    <StyledHeader>
      <div>
        <Popover
          content={
            <Menu>
              <Menu.Item
                icon="log-out"
                text="Sign out"
                onClick={() => (window.location.href = '/auth/sign_out')}
              />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <Button minimal>
            <Avatar src={viewer.picture} />
          </Button>
        </Popover>
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 6px 0px;
  display: flex;
  padding: 6px 20px;

  div:last-of-type {
    margin-left: auto;
  }
`;
