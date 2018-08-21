export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const GET_TODOS = "GET_TODOS";

function handleTodos(data){
    debugger
  return {
    type: GET_TODOS,
    data
  }
}
function handleAdd(todo){
  debugger
  return {
    type: ADD_TODO,
    todo
  }
}
function handleRemove(id){
  debugger
  return {
    type: REMOVE_TODO,
    id
  }
}

export function getTodos(){
  return dispatch => {
    debugger
    return fetch("http://localhost:3001/api/todos")
      .then(res => res.json())
      .then(data => dispatch(handleTodos(data)))
      .catch(err => console.log("Some error: ", err));
  }
}

export function addTodo(task){
  return dispatch => {
    debugger
    return fetch("http://localhost:3001/api/todos", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({task})
    })
      .then(res => res.json())
      .then(data => dispatch(handleAdd(data)))
      .catch(err => console.log("Something went WRONG", err));
  }
}

export function removeTodo(id){
  return dispatch => {
    debugger
    return fetch(`http://localhost:3001/api/todos/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => dispatch(handleRemove(id)))
      .catch(err => console.log("Something went WRONG", err));
  }
}