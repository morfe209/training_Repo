const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (
  state = "SHOW_ALL",
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}
//===============================================================================================
const { combineReducers } = Redux;

const todoApp = combineReducers({
  todos,
  visibilityFilter
});


let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter
  };
};

const { Component } = React;
const { Provider, connect } = ReactRedux;

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return (<span> { children } </span>)
  }
    debugger
  return (
    <a href="#"
      onClick = {(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  )
}

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      )
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);



const Footer = () => (
  <p>
    SHOW:
    {" "}
    <FilterLink
      filter="SHOW_ALL"
    >
      All
    </FilterLink>
    {" "}
    <FilterLink
      filter="SHOW_ACTIVE"
    >
      Active
    </FilterLink>
    {" "}
    <FilterLink
      filter="SHOW_COMPLETED"
    >
      Completed
    </FilterLink>
  </p>
);


const Todo = ({
  onClick,
  completed,
  text
}) => (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none"
      }}>
      {text}
    </li>
  );


const TodoList = ({
  todos,
  onTodoClick
}) => (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
      )}
    </ul>
  );




let AddTodo = (dispatch) => {
  let input;
  return (
    <div>
      <input
        ref={text => {               // ref callback функці яка передає зразу значення реакту від неконтрольованого компонента
          input = text;
        }}
      />
      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = "";          // перевантаження інпуту пустим рядком
      }}>
        Add Todo
      </button>
    </div>

  )
}
AddTodo = connect()(AddTodo);

const getVisibilityTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
}
const mapStateToTodoListProps = (
  state
) => {
  return {
    todos: getVisibilityTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchToTodoListProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}
const { connect } = ReactRedux;
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

const { createStore } = Redux;
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);


////БЕЗ РЕФАКТОРИНГА
// const todo = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return {
//         id: action.id,
//         text: action.text,
//         completed: false
//       };
//     case 'TOGGLE_TODO':
//       if (state.id !== action.id) {
//         return state;
//       }
//       return {
//         ...state,
//         completed: !state.completed
//       };
//     default:
//       return state;
//   }
// };

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         todo(undefined, action)
//       ];
//     case 'TOGGLE_TODO':
//       return state.map(t => todo(t, action));
//     default:
//       return state;
//   }
// };

// const visibilityFilter = (
//   state = "SHOW_ALL",
//   action
// ) => {
//   switch (action.type) {
//     case 'SET_VISIBILITY_FILTER':
//       return action.filter;
//     default:
//       return state;
//   }
// }

// const { combineReducers } = Redux;
// const todoApp = combineReducers({
//   todos,
//   visibilityFilter
// });


// const { createStore } = Redux;
// const store = createStore(todoApp);


// const { Component } = React;

// const FilterLink = ({
//   filter,
//   children,
//   currentFilter,
//   onClick
// }) => {
//   if (filter === currentFilter) {
//     return <span>{children}</span>;
//   }
//   return (
//     <a href="#"
//       onClick={(e) => {
//         e.preventDefault();
//         onClick(filter);
//       }}
//     >
//       {children}
//     </a>
//   )
// }

// const Footer = ({
//   visibilityFilter,
//   onFilterClick
// }) => (
//     <p>
//       SHOW:
//     {" "}
//       <FilterLink
//         filter="SHOW_ALL"
//         currentFilter={visibilityFilter}
//         onClick={onFilterClick}
//       >
//         All
//     </FilterLink>
//       {" "}
//       <FilterLink
//         filter="SHOW_ACTIVE"
//         currentFilter={visibilityFilter}
//         onClick={onFilterClick}
//       >
//         Active
//     </FilterLink>
//       {" "}
//       <FilterLink
//         filter="SHOW_COMPLETED"
//         currentFilter={visibilityFilter}
//         onClick={onFilterClick}
//       >
//         Completed
//     </FilterLink>
//     </p>
//   )

// const Todo = ({
//   onClick,
//   completed,
//   text
// }) => (
//     <li
//       onClick={onClick}
//       style={{
//         textDecoration: completed ? "line-through" : "none"
//       }}>
//       {text}
//     </li>
//   )

// const TodoList = ({
//   todos,
//   onTodoClick
// }) => (
//     <ul>
//       {todos.map(todo =>
//         <Todo
//           key={todo.id}
//           {...todo}
//           onClick={() => onTodoClick(todo.id)}
//         />
//       )}
//     </ul>
//   )

// const AddTodo = ({
//   onAddClick
// }) => {
//   let input;
//   return (
//     <div>
//       <input
//         ref={text => {               // ref callback функці яка передає зразу значення реакту від неконтрольованого компонента
//           input = text;
//         }}
//       />
//       <button onClick={() => {
//         onAddClick(input.value);
//         input.value = "";          // перевантаження інпуту пустим рядком
//       }}>
//         Add Todo
//       </button>
//     </div>

//   )
// }


// const getVisibilityTodos = (todos, filter) => {
//   switch (filter) {
//     case 'SHOW_ALL':
//       return todos;
//     case 'SHOW_COMPLETED':
//       return todos.filter(t => t.completed);
//     case 'SHOW_ACTIVE':
//       return todos.filter(t => !t.completed);
//   }
// }

// let nextTodoId = 0;

// const TodoApp = ({ todos, visibilityFilter }) => (
//   <div>
//     <AddTodo
//       onAddClick={text =>
//         store.dispatch({
//           type: 'ADD_TODO',
//           text: text,            //передавання значення від ref функції
//           id: nextTodoId++
//         })
//     }
//       />
//     <TodoList
//       todos={getVisibilityTodos(
//         todos,
//         visibilityFilter
//       )}
//       onTodoClick={id =>
//         store.dispatch({
//           type: 'TOGGLE_TODO',
//           id
//         })
//       }
//     />
//     <Footer
//       visibilityFilter = {visibilityFilter}
//       onFilterClick = {filter =>
//         store.dispatch({
//           type: "SET_VISIBILITY_FILTER",
//           filter
//         })
//       }
//     />
//   </div>
// );


// const render = () => {
//   ReactDOM.render(
//     <TodoApp
//       {...store.getState()}
//     />,
//     document.getElementById('root')
//   )
// };

// store.subscribe(render);
// render();


// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };


// console.log('Initial state:');
// console.log(store.getState());
// console.log('---------------');
// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 0,
//   text: "Learn Redux"
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('---------------');
// console.log('Dispatching ADD_TODO.');
// store.dispatch({
//   type: 'ADD_TODO',
//   id: 1,
//   text: "Go Shopping"
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('---------------');
// console.log('Dispatching TOGGLE_TODO.');

// store.dispatch({
//   type: 'TOGGLE_TODO',
//   id: 0
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('---------------');

// store.dispatch({
//   type: 'SET_VISIBILITY_FILTER',
//   filter: "SHOW_COMPLETED"
// });
// console.log('Current state:');
// console.log(store.getState());
// console.log('---------------');


