const initialStore ={
  counter:0
}

function rootReeducer (state=initialStore, action){
  switch (action.type) {
    case "INCREMENT":
      var newState = {...state};
      newState.counter++;
      return newState;
    case "DECREMENT":
      var newState = {...state};
      newState.counter--;
      return newState;

    default:
      return state;
  }
}
const store = Redux.createStore(rootReeducer);

$(document).ready(function(){
  let currentState = store.getState();
  $("#counter").text(currentState.counter)

  $("#increment").on("click", function(){
    store.dispatch({
      type: "INCREMENT"
    })
  
    let currentState = store.getState();
    $("#counter").text(currentState.counter)
  })
  $("#decrement").on("click", function(){
    store.dispatch({
      type: "DECREMENT"
    })
  
    let currentState = store.getState();
    $("#counter").text(currentState.counter)
  })
})