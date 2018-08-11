import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Recipe.css';

class Recipe extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        instructions: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
        id: PropTypes.number.isRequired,
        onDelete: PropTypes.func.isRequired
    }


    render() {
        const { title, img, instructions, id, onDelete} = this.props;
        const ingredients = this.props.ingredients.map((ing, index) => (
            <li key={index}>{ing}</li>
        ))

        return (
            <div className="recipe-card">
                <div className="recipe-card-img">
                    <img src={img} alt={title} />
                </div>
                <div className="recipe-card-content">
                    <h3 className="recipe-title"> Reciasdape {title}</h3>
                    <h4>Ingredients: </h4>
                    <ul>
                        {ingredients}
                    </ul>
                    <h4>Ingredients: </h4>
                    <p>{instructions}</p>
                    <button className="buttons" type="button" onClick ={() => onDelete(id)}>DELETE</button>

                </div>
            </div>
        );
    }
}

export default Recipe;
