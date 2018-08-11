import React from 'react';
import './TodoItem.css';

const TodoItem = ({ name, completed, onDelete, onToggle }) => (
  <li className="task">
    <span
      style={{
        textDecoration: completed ? 'line-through' : 'none',
        color: completed ? '#bdc3c7' : '#34495e'
      }}
      onClick={onToggle}
    >
      {name}
    </span>
    
    <span 
      className="deleteButton"
      onClick={onDelete}> X </span>
  </li>
)


export default TodoItem;

