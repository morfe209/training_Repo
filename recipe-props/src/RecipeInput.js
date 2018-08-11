import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './RecipeInput.css';

class RecipeInput extends Component {
  static defaultProps = {
    onClose() {},
    onSave() {}
  }
  
  static propTypes = {
    onClose: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      instructions: '',
      ingredients: [''],
      img: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNewIngredient = this.handleNewIngredient.bind(this);
    this.handleChangeIng = this.handleChangeIng.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleNewIngredient(e){
    const {ingredients} = this.state;
    this.setState({ingredients: [...ingredients,'']});
  }
  handleChangeIng(e){
    const index = Number(e.target.name.split('-')[1]) 
    const ingredients = this.state.ingredients.map((ing, i) => (
        i === index ? e.target.value : ing
      ));
    this.setState({ingredients})
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.onSave({...this.state});
    this.setState({
      title:'',
      instructions:'',
      ingredients:[''],
      img:''
    });
  }

  render() {
    const { title, instructions, img, ingredients } = this.state;
    let inputs = ingredients.map((ing, i) => (
      <div
        className="recipe-form-line"
        key={`ingredient-${i}`}>
        <label>{i+1}.
          <input
            type="text"
            name={`ingredient-${i}`}
            value={ing}
            size={43}
            autoComplete='off'
            placeholder='Ingredient'
            onChange={this.handleChangeIng} />
        </label>
      </div>
    ));
    return (
      <div className="recipe-form-container">
        <form className="recipe-form" onSubmit={this.handleSubmit}>
          
          <button
            className="close-button"
            type="button"
            onClick={this.props.onClose}
          >
            X
				</button>
          
          <div className="recipe-form-line">
            <label htmlFor="recipe-title-input">Title</label>
            <input
              id="recipe-title-input"
              key='title'
              name='title'
              type="text"
              value={title}
              size={42}
              autoComplete='off'
              onChange={this.handleChange} />
          </div>

          <label
            htmlFor="recipe-instructions-input"
            style={{ marginTop: '5px' }}
          >
            Instructions
				  </label>
          <textarea
            key='instructions'
            id="recipe-instructions-input"
            type='Instructions'
            name="instructions"
            rows="8"
            cols="50"
            autoComplete='off'
            value={instructions}
            onChange={this.handleChange} />

          {inputs}

          <button
            className="buttons"
            type='button'
            onClick={this.handleNewIngredient}>
            +
				  </button>

          <div className="recipe-form-line">
            <label htmlFor="recipe-img-input">Image Url</label>
            <input
              id="recipe-img-input"
              type="text"
              placeholder=""
              name="img"
              value={img}
              size={36}
              autoComplete="off"
              onChange={this.handleChange} />
				  </div>
          
          <button
              className="buttons"
              type="submit"
              style={{ alingSelf: 'flex-end', marginRight: 0 }}>
              SAVE
				  </button>
			</form>
		</div>

        )
    }
  }
    	
  export default RecipeInput;
    	
