import React, {Component} from 'react';

export default class NewTodoForm extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      task: ""
    }
  }

  handleSubmit(event){
    
    event.preventDefault();
    this.props.handleSubmit(this.state.task);
     
    event.target.reset( );
    this.props.history.push("/todos");
  }
  handleChange(event){
    
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render(){
    return(
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

    )
  }
}