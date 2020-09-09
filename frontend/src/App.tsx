import React from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './containers/Home/Home';
import Login from './containers/login/Login';
export default function FullWidthGrid() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
