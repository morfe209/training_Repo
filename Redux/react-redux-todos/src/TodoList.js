import React, { Component } from 'react';
import Todo from './Todo';
import NewTodoForm from './NewTodoForm';
import { connect } from 'react-redux';
import { addTodo, removeTodo, getTodos} from './actionCreators'
import {Route} from 'react-router-dom'

class TodoList extends Component{
  constructor(props){
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
  }
  componentDidMount(){
    debugger
    this.props.getTodos();
  }
  handleAdd(val){
    debugger
    this.props.addTodo(val);
  }  

  removeTodo(id){
    debugger
    this.props.removeTodo(id);
  }
  render(){
    debugger
    let todos = this.props.todos.map(val => (
        <Todo 
          key={val._id}
          task={val.task}
          removeTodo={this.removeTodo.bind(this, val._id)}
        />
      ))
    return(
      <div>
        <Route
          path="/todos/new"
          component={props =>(
            <NewTodoForm {...props} handleSubmit={this.handleAdd}/>
          )} />
        <Route 
          exact
          path="/todos" 
          component={() => (
            <div>{todos}</div>
          )} />
      </div>
    )
  }

}

function mapStateToProps(reduxState){
  debugger
  return{
    todos: reduxState.todos,
    id: reduxState.id
  }
}

export default connect(mapStateToProps, { addTodo, removeTodo, getTodos })(TodoList);

