import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  Alignment,
  Button,
  Menu,
  Navbar,
  Popover,
  Position,
} from '@blueprintjs/core';

import { ViewerContext } from '../contexts/ViewerContext';
import { Avatar } from '../components/Avatar';

export const Nav = () => {
  const viewer = React.useContext(ViewerContext);

  return (
    <StyledNavbar>
      <Navbar.Group align={Alignment.LEFT}>
        <StyledNavLink to="/">
          <Navbar.Heading>Tasky</Navbar.Heading>
        </StyledNavLink>
        <Navbar.Divider />
        <StyledNavLink to="/">
          <Button minimal icon="home" text="Home" />
        </StyledNavLink>
        <StyledNavLink to="/todos">
          <Button minimal icon="build" text="Todos" />
        </StyledNavLink>
        <StyledNavLink to="/files">
          <Button minimal icon="document" text="Files" />
        </StyledNavLink>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
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
      </Navbar.Group>
    </StyledNavbar>
  );
};

const StyledNavbar = styled(Navbar)`
  padding: 0 40px;
`;

const StyledNavLink = styled(NavLink)`
  &:hover {
    text-decoration: none;
  }
`;
