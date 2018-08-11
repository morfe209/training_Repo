import React, { Component } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import * as apiCalls from './api';
import './TodoList.css';


class TodoList extends Component {

  constructor(props) {
    super(props);
    this.state = { todos: [] }

    this.addTodo = this.addTodo.bind(this);
  }

  componentWillMount() {
    this.loadTodos();
  }

  async loadTodos() {
    let todos = await apiCalls.getTodos();
    this.setState({ todos });
  }

  async addTodo(val) {
    let newTodo = await apiCalls.postTodo(val);
    this.setState({ todos: [...this.state.todos, newTodo] });
  }

  async deleteTodo(id) {
    await apiCalls.deleteTodo(id);
    const todos = this.state.todos.filter(todo => todo._id !== id)
    this.setState({ todos: todos })
  }
  async toggleTodo(todo) {
    let updatedTodo = await apiCalls.putTodo(todo);
    
    let todos = this.state.todos.map(todo =>
        (todo._id === updatedTodo._id)
          ? { ...todo, completed: !todo.completed }
          : todo
      )
      this.setState({ todos: todos });
  }

  render() {
    const todos = this.state.todos.map(todo => (
      <TodoItem
        key={todo._id}
        {...todo}
        onDelete={this.deleteTodo.bind(this, todo._id)}
        onToggle={this.toggleTodo.bind(this, todo)}
      />
    ));
    return (
      <div>
        <TodoForm addTodo={this.addTodo} />
        <ul className="list">
          {todos}
        </ul>
      </div>


    );
  }
}

export default TodoList;
