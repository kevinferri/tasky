import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Nav } from './Nav';
import { Home } from '../pages/Home';
import { Files } from '../pages/Files';
import { Todos } from '../pages/Todos';
import { NotFound } from '../pages/NotFound';

export const Root = () => {
  return (
    <div>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/todos" component={Todos} />
        <Route exact path="/files" component={Files} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};
