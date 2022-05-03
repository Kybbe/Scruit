const initialState = {
  todos: {},
};

const MenuReducer = (state = initialState, action) => {
  switch(action.type) {
    //payload is an object with the following properties:
    // name: the name of the board to which the todo belongs
    // todo: the todo object
    case "ADD_TODO":
      let todosInBoard = state.todos[action.payload.name];
      todosInBoard.push(action.payload.todo);

      //add todosInBoard to state.todos
      let newTodos = {...state.todos};
      newTodos[action.payload.name] = todosInBoard;

      return {
        ...state, 
        todos: newTodos
      };
    case 'REMOVE_TODO':
      let todosInBoardToRemove = state.todos[action.payload.board];
      let newTodosToKeep = todosInBoardToRemove.filter(todo => todo.id !== Number(action.payload.id));

      //add todosInBoardToRemove to state.todos
      let newTodosToRemoveState = {...state.todos};
      newTodosToRemoveState[action.payload.board] = newTodosToKeep;

      return {
        ...state,
        todos: newTodosToRemoveState
      };
    case 'UPDATE_TODOS':
      return {
        ...state,
        todos: action.payload
      };
    case "ADD_BOARD":
      let newBoards = {...state.todos};
      newBoards[action.payload] = []; //initialize new board with empty todos array

      return {
        ...state,
        todos: newBoards
      };
    case "REMOVE_BOARD":
      let newBoards2 = {...state.todos};
      delete newBoards2[action.payload];

      return {
        ...state,
        todos: newBoards2
      };
    default:
      return state
    }
  }
  
  export default MenuReducer;