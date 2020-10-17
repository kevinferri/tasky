import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

export const Sidebar = () => {
  return (
    <StyledSidebar>
      <StyledNavLink exact to="/">
        <BrandHeader>Tasky</BrandHeader>
      </StyledNavLink>
      <StyledNavLink exact activeClassName="cur-link" to="/">
        <Button large minimal icon="home" text="Home" />
      </StyledNavLink>
      <StyledNavLink exact activeClassName="cur-link" to="/todos">
        <Button large minimal icon="build" text="Todos" />
      </StyledNavLink>
      <StyledNavLink exact activeClassName="cur-link" to="/files">
        <Button large minimal icon="document" text="Files" />
      </StyledNavLink>
    </StyledSidebar>
  );
};

const StyledSidebar = styled.nav`
  align-self: stretch;
  background: rgb(240, 240, 240);
  flex: 0 0 200px;
  min-height: 100vh;
  padding: 20px;
`;

const BrandHeader = styled.h1`
  margin: 0 0 22px 12px;
`;

const StyledNavLink = styled(NavLink)`
  display: block;

  &.cur-link {
    background: rgba(167, 182, 194, 0.3);
  }

  button {
    display: block;
    width: 100%;

    &:focus,
    &:active {
      outline: none;
    }
  }

  h3 {
    display: inline-flex;
    margin: 0 0 0 10px;
  }

  &:hover {
    text-decoration: none;
  }
`;
