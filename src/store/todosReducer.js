const initialState = {
	todos: {},
	currentEditTodo: {},
	colors: [],
	automatedDoneBoard: "",
};

const MenuReducer = (state = initialState, action) => {
	switch (action.type) {
		//payload is an object with the following properties:
		// name: the name of the board to which the todo belongs
		// todo: the todo object
		case "ADD_TODO": {
			const todosInBoard = state.todos[action.payload.name];
			todosInBoard.push(action.payload.todo);

			//add todosInBoard to state.todos
			const newTodos = { ...state.todos };
			newTodos[action.payload.name] = todosInBoard;

			return {
				...state,
				todos: newTodos,
			};
		}
		case "REMOVE_TODO": {
			const todosInBoardToRemove = state.todos[action.payload.board];
			const newTodosToKeep = todosInBoardToRemove.filter(
				(todo) => todo.id !== action.payload.id,
			);

			//add todosInBoardToRemove to state.todos
			const newTodosToRemoveState = { ...state.todos };
			newTodosToRemoveState[action.payload.board] = newTodosToKeep;

			return {
				...state,
				todos: newTodosToRemoveState,
			};
		}
		case "COMPLETE_TODO": {
			const todosInBoardToComplete = state.todos[action.payload.board];
			const newTodosToComplete = todosInBoardToComplete.map((todo) => {
				if (todo.id === action.payload.id) {
					todo.completed = !todo.completed;
				}
				return todo;
			});

			return {
				...state,
				todos: {
					...state.todos,
					[action.payload.board]: newTodosToComplete,
				},
			};
		}
		case "UPDATE_TODO": {
			const todosInBoardToUpdate = state.todos[action.payload.board];
			const newTodosToUpdate = todosInBoardToUpdate.map((todo) => {
				if (todo.id === action.payload.id) {
					return {
						name: action.payload.name,
						id: todo.id,
						tags: action.payload.tags,
						date: action.payload.date,
						time: action.payload.time,
					};
				}
				return todo;
			});

			return {
				...state,
				todos: {
					...state.todos,
					[action.payload.board]: newTodosToUpdate,
				},
			};
		}
		case "SET_AUTOMATED_DONE_BOARD":
			return {
				...state,
				automatedDoneBoard: action.payload,
			};
		case "UPDATE_TODOS":
			return {
				...state,
				todos: action.payload,
			};
		case "ADD_BOARD": {
			const newBoards = { ...state.todos };
			newBoards[action.payload] = []; //initialize new board with empty todos array

			return {
				...state,
				todos: newBoards,
			};
		}
		case "REMOVE_BOARD": {
			const newBoards2 = { ...state.todos };
			delete newBoards2[action.payload];

			return {
				...state,
				todos: newBoards2,
			};
		}
		case "SET_CURRENT_EDIT_TODO":
			return {
				...state,
				currentEditTodo: action.payload,
			};
		case "DELETE_ALL":
			return {
				...state,
				todos: {},
				currentEditTodo: {},
				colors: [],
				automatedDoneBoard: "",
			};
		case "SET_COLORS":
			return {
				...state,
				colors: action.payload,
			};
		default:
			return state;
	}
};

export default MenuReducer;
