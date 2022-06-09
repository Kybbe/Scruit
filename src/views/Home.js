import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

import ListComponent from "../components/ListComponent";
import EditTodoModal from "../components/EditTodoModal";

import Navbar from "./Navbar";

export default function Home() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const boards = Object.keys(todos);
  const boardName = useRef("")

  function addBoard(){
    let name = boardName.current.value;
    if (name) {
      dispatch({ type: "ADD_BOARD", payload: name });
      boardName.current.value = "";
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      addBoard();
    }
  } 

  const removeFromList = (list, index) => {
    const result = Array.from(list); // make a separate copy of the array
    const [removed] = result.splice(index, 1); // remove element
    return [removed, result]; // return new array
  };
  
  const addToList = (list, index, element) => {
    const result = Array.from(list); // make a separate copy of the array
    result.splice(index, 0, element); // add element
    return result; // return new array
  };

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if(!destination) { return; } //if the draggable is dropped outside the list, do nothing
    if(destination.droppableId === "TRASH"){ //if the item is dropped in the trash
      dispatch({ type: "REMOVE_TODO", payload: {board: source.droppableId, id: draggableId} });
      return;
    }
    
    const listCopy = { ...todos }; //copy the list

    const sourceList = listCopy[source.droppableId]; //get the source list, where the draggable was dragged from
    const [removedElement, newSourceList] = removeFromList( //remove the draggable from the source list
      sourceList,
      source.index
    );
    listCopy[source.droppableId] = newSourceList; //set the new source list
    const destinationList = listCopy[destination.droppableId]; //get the destination list, where the draggable was dragged to
    listCopy[destination.droppableId] = addToList( //add the draggable to the destination list
      destinationList,
      destination.index,
      removedElement
    );

    dispatch({ type: "UPDATE_TODOS", payload: listCopy }); //update the state
  };

  return (
    <div className="home">
      <h1>Scruit</h1>
      <Navbar />

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
      <EditTodoModal />
    </div>
  );
}
