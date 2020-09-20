import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Login from './pages/Login';
import LoginTeacher from './pages/Teacher/LoginTeacher';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/loginteacher' component={LoginTeacher} />
      </Switch>
    </Router>
  );
}

export default App;
