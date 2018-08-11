import React, { Component } from 'react';
import './FlagQuestion.css';
import FlagChoices from './FlagChoices';
import FlagAnswer from './FlagAnswer';

const QuestionStates = {
  QUESTION: 1,
  ANSWER_WRONG: 2,
  ANSWER_CORRECT: 3
};

class FlagQuestion extends Component {
  static defaultProps = {
    options: []
  }
  constructor(props) {
    super(props);
    this.state = {
      userChoise: undefined
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(e){
    this.setState({userChoise: Number(e.target.value)});
  }
handleSubmit(e){
  e.preventDefault();
  this.props.onGuess(this.state.userChoise);
}

  render() {
    const {
      flag,
      questionState,
      options,
      answerText,
      onNext
    } = this.props;
    const { userChoise } = this.state;
    let opts = options.map(opt => ({
      ...opt,
      checked: userChoise === opt.id
    }));
    let output = questionState === QuestionStates.QUESTION ?
      (<FlagChoices 
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        options={opts} />) :
      (<FlagAnswer
        correct={questionState === QuestionStates.ANSWER_CORRECT}
        answer={answerText}
        onNext={onNext} />);
    return (
      <div>
        {output}
        <img
          className="flag-img"
          src={flag}
          alt="Guess the flag"
        />
      </div>
    );

  }
}
export default FlagQuestion;
export { QuestionStates };