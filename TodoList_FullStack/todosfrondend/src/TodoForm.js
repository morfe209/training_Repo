import React, {Component} from 'react';
import './TodoForm.css';

class TodoForm extends Component {
  
  constructor(props) {
    super(props);
    this.state= {inputValue: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress(e){
    if(e.key === 'Enter'){
     this.handleSubmit();
    }
  }
  handleChange(e){
    this.setState({inputValue: e.target.value});
  }

  handleSubmit(){
    let input = this.state.inputValue;
    if(input !== ''){
      this.props.addTodo(this.state.inputValue);
      this.setState({inputValue: ''});
    } return;
  }

  render() {

    return (
      <div className="form">
        <input
          className="todoInput" 
          type = "text"
          value = {this.state.inputValue}
          onChange = {this.handleChange}
          onKeyPress = {this.handleKeyPress}
         />

        <button
          onClick = {this.handleSubmit}
        >
          Add Todo
        </button>
      </div>      
    )
  }
}



export default TodoForm;
