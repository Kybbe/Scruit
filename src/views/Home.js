import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

import ListComponent from "../components/ListComponent";
import UniversalModal from "../components/UniversalModal";

import { v4 as uuidv4 } from 'uuid';

export default function Home() {

  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const boards = Object.keys(todos);
  const tagsInput = useRef("");
  const todoName = useRef("")
  const boardName = useRef("")
  const selectedBoard = useRef(0)

  function addTodo() {
    let name = todoName.current.value;
    let tags = tagsInput.current.value;

    // make tags a array of strings split by ", "
    tags = tags.split(", ");
    if(tags[0] === "") { tags = []; }
    if (name) {
      //find board by board.id, and make todo.order equal to the length of that board's todos array
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: tags,
      }

      dispatch({ type: "ADD_TODO", payload: {name: selectedBoard.current.value, todo: newTodo}});
      todoName.current.value = "";
    }
  }

  function addBoard(){
    let name = boardName.current.value;
    if (name) {
      dispatch({ type: "ADD_BOARD", payload: name });
      boardName.current.value = "";
    }
  }

  async function addKanbanPreset() {
    await dispatch({ type: "ADD_BOARD", payload: "To Do" });
    await dispatch({ type: "ADD_BOARD", payload: "In Progress" });
    await dispatch({ type: "ADD_BOARD", payload: "Done" });

    let names = ["Buy coffee", "Brew coffee", "Drink coffee", "Eat coffee", "Sleep"];
    let todos = names.map((name, index) => {
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: ["coffee"],
      }
      return newTodo;
    })
    todos.forEach(todo => dispatch({ type: "ADD_TODO", payload: {name: "To Do", todo: todo} }))
  }

  async function addLargeKanbanPreset() {
    let boardNames = ["To Do", "Backlog", "Sprint backlog", "In Progress", "Testing", "Needs to be deployed", "Done"];
    boardNames.forEach(name => dispatch({ type: "ADD_BOARD", payload: name }))

    let names = ["Buy coffee", "Brew coffee", "Drink coffee", "Eat coffee", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3"];
    let tags = ["Coffee", "Code", "Game", "Form", "Register", "Stuff"];
    let todos = names.map((name, index) => {
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: tags.slice(Math.floor(Math.random() * tags.length)),
      }
      let randomBoard = Math.floor(Math.random() * boardNames.length);
      return {name: boardNames[randomBoard], todo: newTodo};
    })
    todos.forEach(todo => dispatch({ type: "ADD_TODO", payload: {name: todo.name, todo: todo.todo} }))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if(e.target.id === "todoName"){
        addTodo();
      }
      if(e.target.id === "boardName"){
        addBoard();
      }
    }
  }

  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };
  
  const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if(!destination) { return; }
    if(destination.droppableId === "TRASH"){
      dispatch({ type: "REMOVE_TODO", payload: {board: source.droppableId, id: draggableId} });
      return;
    }
    
    const listCopy = { ...todos };

    const sourceList = listCopy[source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      source.index
    );
    listCopy[source.droppableId] = newSourceList;
    const destinationList = listCopy[destination.droppableId];
    listCopy[destination.droppableId] = addToList(
      destinationList,
      destination.index,
      removedElement
    );

    dispatch({ type: "UPDATE_TODOS", payload: listCopy });
  };

  return (
    <div>
      <h1>Scruit</h1>
        { boards.length > 0 ? (
          <div>
            <input id="todoName" type="text" ref={todoName} onKeyDown={handleKeyDown} placeholder="As a [who], I want [what] so that [why]"></input>
            <input id="tags" type="text" ref={tagsInput} placeholder="Tags, seperated, with, commas"></input>
            <button onClick={addTodo}>Add Todo</button>
            <select id="selectBoard" ref={selectedBoard} defaultValue={boards[0]}>
              {boards.map((board, index) => (
                <option key={index} value={board}>{board}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <p>Add a board down below!</p>
            <button onClick={addKanbanPreset}>Add kanban preset</button>
            <button onClick={addLargeKanbanPreset}>Add large kanban preset</button>
          </div>
        )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="boards"
        >
          {boards.map((board, index) => (
            <ListComponent key={index} board={board} index={index}/>
          ))}
          <div className="addBoard droppable">
            <input id="boardName" type="text" ref={boardName} onKeyDown={handleKeyDown} placeholder="Board title"></input>
            <button onClick={addBoard}>Add Board</button>
            <Droppable droppableId={"TRASH"}>
              {(provided, snapshot) => (
                <div
                ref={provided.innerRef}
                className={snapshot.isDraggingOver ? "droppable trash over-droppable" : "droppable trash"}
                {...provided.droppableProps}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      <UniversalModal />
    </div>
  );
}
