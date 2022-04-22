import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

import ListComponent from "../components/ListComponent";

export default function Home() {

  const dispatch = useDispatch();
  const boards = useSelector(state => state.boards);
  const todos = useSelector(state => state.todos);
  const todoName = useRef("")
  const boardName = useRef("")
  const selectedBoard = useRef(0)

  function addTodo() {
    let name = todoName.current.value;
    if (name) {
      dispatch({ type: "ADD_TODO", payload: {name: name, id: todos.length, boardId: Number(selectedBoard.current.value)} });
      todoName.current.value = "";
    }
  }

  function addBoard(){
    let name = boardName.current.value;
    if (name) {
      dispatch({ type: "ADD_BOARD", payload: {title: name, id: boards.length} });
      boardName.current.value = "";
    }
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

  const onBeforeCapture = () => {
    /*...*/
  };
  const onBeforeDragStart = () => {
    /*...*/
  };
  const onDragStart = () => {
    /*...*/
  };
  const onDragUpdate = (result) => {
    /*...*/
  };
  function onDragEnd(result) {
    if(!result.destination) { return; }
    if(result.destination.droppableId === "TRASH"){
      dispatch({ type: "REMOVE_TODO", payload: result.source.index });
      return;
    }

    //if the draggable is dropped in a new droppable,
    //we need to change the boardId of the todo
    if (result.destination.droppableId !== result.source.droppableId) {
      let newBoardId = Number(result.destination.droppableId.split("-")[1]) +1;
      dispatch({ type: "CHANGE_TODO_BOARD", payload: {id: result.source.index, boardId: newBoardId} });
    }
    else {
      const items = Array.from(todos);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      dispatch({ type: "REORDER_TODO", payload: items });

      console.log("items", items);
    }
  };

  return (
    <div>
      <h1>Scruit</h1>
        { boards.length > 0 ? (
          <div>
            <input id="todoName" type="text" ref={todoName} onKeyDown={handleKeyDown} placeholder="As a [who], I want [what] so that [why]"></input>
            <button onClick={addTodo}>Add Todo</button>
            <select id="selectBoard" ref={selectedBoard} defaultValue="0">
              {boards.map((board, index) => (
                <option key={index} value={board.id +1}>{board.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <p>Add a board down below!</p>
        )}

      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <div className="boards"
        >
          {boards.map((board, index) => (
            <ListComponent key={board.id} board={board} index={index} listWidth={100 / boards.length} />
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
    </div>
  );
}
