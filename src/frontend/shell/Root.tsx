import * as React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Home } from '../pages/Home';
import { Files } from '../pages/Files';
import { Todos } from '../pages/Todos';
import { NotFound } from '../pages/NotFound';

export const Root = () => {
  const [sortDirection, setSortDirection] = React.useState('-');
  const [sortField, setSortField] = React.useState('createdAt');

  return (
    <App>
      <Sidebar />
      <Right>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/todos" component={Todos} />
          <Route
            exact
            path="/files"
            render={() => (
              <Files
                sortDirection={sortDirection}
                sortField={sortField}
                setSortDirection={setSortDirection}
                setSortField={setSortField}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Right>
    </App>
  );
};

const App = styled.div`
  display: flex;
  width: 100%;
`;

const Right = styled.div`
  width: 100%;
`;
