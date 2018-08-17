import React, { Component } from 'react';
import Todo from './Todo';
import { connect } from 'react-redux';
import { addTodo, removeTodo} from './actionCreators'

class TodoList extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.state = {
      task: ""
    }
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.addTodo(this.state.task);
    event.target.reset( ); 
  }
  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  removeTodo(id){
    this.props.removeTodo(id);
  }
  render(){
    let todos = this.props.todos.map((val, index) => (
        <Todo 
          key={index}
          task={val.task}
          removeTodo={this.removeTodo.bind(this, val.id)}
        />
      ))
    return(
      <div>
        <form onSubmit = {this.handleSubmit}>
          <label htmlFor="task">Task: </label>
          <input
            type="text"
            name="task"
            id="task"
            onChange={this.handleChange}
            />
          <button>add a Todo</button>

        </form>
        <ul>
          {todos}
        </ul>
      </div>
    )
  }

}

function mapStateToProps(reduxState){
  return{
    todos: reduxState.todos,
    id: reduxState.id
  }
}

export default connect(mapStateToProps, { addTodo, removeTodo })(TodoList);

