const initialState = {
  todos: [],
  boards: [],
};

const MenuReducer = (state = initialState, action) => {
  switch(action.type) {
    //send in entire menu
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case 'REMOVE_TODO':
      //remove todo with id in payload
      let newArr = state.todos.filter(todo => todo.id !== action.payload)
      //lower id of all todo in todos array
      newArr = newArr.map(todo => {
        if (todo.id > action.payload) {
          todo.id--;
        }
        return todo;
      })

      return {
        ...state,
        todos: newArr
      }
    case 'REORDER_TODO':
      return {
        ...state,
        todos: action.payload
      }
    case 'CHANGE_TODO_BOARD':
      //change boardId of todo with id in payload
      let newTodos = state.todos.map(todo => {
        if (todo.id === action.payload.id) {
          todo.boardId = action.payload.boardId;
        }
        return todo;
      })
      return {
        ...state,
        todos: newTodos
      }
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.payload]
      }
    case 'REMOVE_BOARD':
      let newBoardArr = state.boards.filter(board => board.id !== action.payload)

      newBoardArr = newBoardArr.map(board => {
        if (board.id > action.payload) {
          board.id--;
        }
        return board;
      })

      //remove all todos with boardId equal to payload
      let newTodoArr = state.todos.filter(todo => todo.boardId !== action.payload+1)

      return {
        ...state,
        boards: newBoardArr,
        todos: newTodoArr
      }
    default:
      return state
    }
  }
  
  export default MenuReducer;