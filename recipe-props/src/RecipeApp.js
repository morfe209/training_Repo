import React, { Component } from 'react';
import Navbar from './Navbar';
import RecipeInput from './RecipeInput';
import RecipeList from './RecipeList';
import './RecipeApp.css';

class RecipeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [
        {
          id: 0,
          title: "pasta",
          ingredients: ["flour", "water"],
          instructions: "Mix all thigs",
          img: "https://raw.githubusercontent.com/rithmschool/udemy_course_exercises/master/react/recipe-props-starter/public/spaghetti.jpg"
        },
        {
          id: 1,
          title: "pasta",
          ingredients: ["flour", "water"],
          instructions: "Mix all thigs",
          img: "https://raw.githubusercontent.com/rithmschool/udemy_course_exercises/master/react/recipe-props-starter/public/spaghetti.jpg"
        },
        {
          id: 2,
          title: "pasta",
          ingredients: ["flour", "water"],
          instructions: "Mix all thigs",
          img: "https://raw.githubusercontent.com/rithmschool/udemy_course_exercises/master/react/recipe-props-starter/public/spaghetti.jpg"
        }],
      nextRecipeId: 3,
      showForm: false
    }

    this.handleSave = this.handleSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  handleSave(recipe) {
    this.setState((prevState, props) => {
      const newRecipe = {...recipe, id: this.state.nextRecipeId};
      return {
        nextRecipeId: prevState.nextRecipeId+1,
        showForm: false,
        recipes: [...this.state.recipes, newRecipe]
      }
    });
  }

  onDelete(id) {
    const recipes = this.state.recipes.filter(r => r.id !== id);
    this.setState({recipes});
  }

  render() {
    const {showForm} = this.state;
    return (
      <div className="app">
        <Navbar onNewRecipe ={() => this.setState({showForm: true})}/>

        { showForm ? 
              <RecipeInput 
                onSave={this.handleSave} 
                onClose={()=>this.setState({showForm: false})}/>
                   : null }
        <RecipeList onDelete={this.onDelete} recipes={this.state.recipes} />
      </div>
    );
  }
}

export default RecipeApp;
