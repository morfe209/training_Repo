import React, { Component } from 'react';
import './App.css';
import TodoList from './TodoList'
import {Link, Route, Redirect} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>See Our TodoList</h1>
        <p>
          <Link to="/todos">See my todos</Link>
        </p>
        <p>
          <Link to="/todos/new">Add new todo</Link>
        </p>
        <Route path="/todos" component = {TodoList}/>
        <Route 
          exact
          path="/"
          render={() => 
            <Redirect to="/todos"/>
          }/>
      </div>
    );
  }
}

export default App;
