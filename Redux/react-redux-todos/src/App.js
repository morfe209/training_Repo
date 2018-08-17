import React, { Component } from 'react';
import './App.css';
import TodoList from './TodoList'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>See Our TodoList</h1>
        <TodoList></TodoList> 
      </div>
    );
  }
}

export default App;
