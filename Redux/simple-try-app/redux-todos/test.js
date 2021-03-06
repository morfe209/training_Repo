const initialStore = {
  todos: [],
  id: 0
}

function rootReeducer(state = initialStore, action) {
  switch (action.type) {
    case "ADD_TODO":
      var newState = { ...state };
      newState.id++;
      return {
        ...newState,
        todos: [...newState.todos, { task: action.task, id: newState.id }]
      };

    case "REMOVE_TODO":
      let todos = state.todos.filter(todo => todo.id !== +action.id);
      return { ...state, todos };

    default:
      return state;
  }
}
const store = Redux.createStore(
  rootReeducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

$(document).ready(function() {
  $("ul").on("click", "button", function(event) {
    store.dispatch({
      type: "REMOVE_TODO",
      id: $(event.target).attr("id")
    });
    $(event.target).parent().remove()
  });

  $("form").on("submit", function(event) {
    event.preventDefault();
    let newTask = $("#task").val();
    store.dispatch({
      type: "ADD_TODO",
      todo: newTask
    });

    let currentState = store.getState();
    let $newLi = $("<li>", { text: newTask });
    let $newButton = $("<button>", { text: "X", id: currentState.id });
    $newLi.append($newButton);
    $("#todos").append($newLi);
    $("form").trigger("reset");
  });
});