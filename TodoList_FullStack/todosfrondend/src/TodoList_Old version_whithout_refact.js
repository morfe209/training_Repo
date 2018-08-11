import React, {Component} from 'react';
import './TodoList.css';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const APIURL = '/api/todos/';



class TodoList extends Component {
  
  constructor(props) {
    super(props);
    this.state={todos: []}

    this.addTodo = this.addTodo.bind(this);
  }

  componentWillMount(){
    this.loadTodos();
  }

  loadTodos(){
    fetch(APIURL)
      .then(resp => {
        if(!resp.ok){
          if(resp.status >= 400 && resp.status < 500){
            return resp.json().then(data => {
              let err = {errorMessage: data.message}
              throw err;
            })
          } else {
              let err = {errorMessage: 'Please try again later, server is not responding'};
              throw err;
          }
        }
        return resp.json();
      })
      .then(todos => this.setState({todos}));
  }

  addTodo(val){
    fetch(APIURL, {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({name: val})
    })
      .then(resp => {
        if(!resp.ok){
          if(resp.status >= 400 && resp.status < 500){
            return resp.json().then(data => {
              let err = {errorMessage: data.message}
              throw err;
            })
          } else {
              let err = {errorMessage: 'Please try again later, server is not responding'};
              throw err;
          }
        }
        return resp.json();
      })
      .then(newTodo => this.setState({todos: [...this.state.todos, newTodo]}));
  }

  deleteTodo(id){
    const deleteUrl = APIURL + id;
    fetch(deleteUrl, {
      method: "delete"
    })
      .then(resp => {
        if(!resp.ok){
          if(resp.status >= 400 && resp.status < 500){
            return resp.json().then(data => {
              let err = {errorMessage: data.message}
              throw err;
            })
          } else {
              let err = {errorMessage: 'Please try again later, server is not responding'};
              throw err;
          }
        }
        return resp.json();
      })
      .then(() => {
        const todos = this.state.todos.filter(todo => todo._id !== id)
        this.setState({todos: todos})
      });
  }
  toggleTodo(todo){
    const updateURL = APIURL + todo._id;
    fetch(updateURL, {
      method: "put",
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({completed: !todo.completed})
    })
      .then(resp => {
        if(!resp.ok){
          if(resp.status >= 400 && resp.status < 500){
            return resp.json().then(data => {
              let err = {errorMessage: data.message}
              throw err;
            })
          } else {
              let err = {errorMessage: 'Please try again later, server is not responding'};
              throw err;
          }
        }
        return resp.json();
      })
      .then(updatedTodo => {
        const todos = this.state.todos.map(todo =>
          (todo._id === updatedTodo._id)
          ? {...todo, completed: !todo.completed}
          : todo
        )
        this.setState({todos: todos});
      });
  }

  render(){
    const todos = this.state.todos.map(todo => (
        <TodoItem 
          key={todo._id}
          {...todo} 
          onDelete = {this.deleteTodo.bind(this,todo._id)}
          onToggle = {this.toggleTodo.bind(this,todo)}
        />
      ));
    return (
      <div>
        <h1>Todo List</h1>
        <TodoForm addTodo = {this.addTodo}/>
        <ol>
          {todos}
        </ol>
      </div>
          

      );
  }
}

export default TodoList;
