import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const TodoItem = ({text}) =>(
    <li>{text}</li>
);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      todos: [],
      newTodo: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault();
    const todos = [...this.state.todos, this.state.newTodo];
    this.setState({todos, newTodo: ''});
  }

  render() {
      const {newTodo} = this.state;
      const todos = this.state.todos.map((todo, index) =>(
        <TodoItem key={index} text={todo} />
      ));
      
      return (
        <div className="App">
          <h1>Simple Todo App</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              className="todo-input"
              autoComplete="off"
              type="text"
              name="newTodo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange = {(e) => this.setState( {[e.target.name]: e.target.value} )}
            />
            <button 
              type="submit"
              className="save-button">
              SAVE
            </button>
          </form>

         <ol>
            {todos}
         </ol>
        </div>
    );
  }
}

export default App;


