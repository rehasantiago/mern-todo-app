import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard"
import NewTodo from './components/NewTodo';

class App extends Component {
  render(){
    return (
      <div>
        <Router>
          <br/>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/create" component={NewTodo} />
        </Router>
      </div>
    );
  }
}

export default App;
