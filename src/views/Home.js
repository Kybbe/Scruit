import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

import ListComponent from "../components/ListComponent";
import EditTodoModal from "../components/EditTodoModal";

import { v4 as uuidv4 } from 'uuid';

import Navbar from "./Navbar";

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
        date: "",
        time: "",
        completed: false,
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
      let trueOrFalse = Math.random() > 0.5
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: ["coffee"],
        date: randomDate(),
        time: randomTime(),
        completed: trueOrFalse,
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
      let trueOrFalse = Math.random() > 0.5
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: tags.slice(Math.floor(Math.random() * tags.length)),
        date: randomDate(),
        time: randomTime(),
        completed: trueOrFalse,
      }
      let randomBoard = Math.floor(Math.random() * boardNames.length);
      return {name: boardNames[randomBoard], todo: newTodo};
    })
    todos.forEach(todo => dispatch({ type: "ADD_TODO", payload: {name: todo.name, todo: todo.todo} }))
  }

  async function stressTestBoard() {
    let boardNames = ["ASDASDASDASDASDASDADS", "asdASDJKL ASDjl ASDljkADSLJK ADS JL", "3", "!,.()/{} [] sdasjkl ,  , m mas mads", "ASJL ASJK LASDLJ KDSJLK AJ KLDSAJLK ADSJLK DASJLKDJLK ASJL KDASLJK DSALJK DASJLKDLJS KAALDSJ LJ KDSAL JKDSA"];
    boardNames.forEach(name => dispatch({ type: "ADD_BOARD", payload: name }))

    let names = ["ASLDKJASLDKJASLDKLJASDL KASLJ DKL JASL JKDASJKL L JKDALS JDSLJ ALJ KADSAKLJ SKJLJL AKSDL JKSADJL KSL JKLJ KDASLJ KDSA", "ASDJASDJASDKJHASKDJHASKDJHASKDJAKSDJHAKSDJHKAJHSD", "3", "!;?=)(/&%€#{}{}{}}[[][]][|§|[]≈±≈][|§∞$£¥¢‰}≠¿", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3", "Sleep", "Code", "Game", "Add form to login", "Register old users", "asd", "Stuff", "3"];
    let tags = ["Coffee", "Code", "Game", "Form", "Register", "Stuff", "HBNKIUYGJKIUHAKSDJALSHALKSDJLASKJDLASKJDALSKD", "AJ KLSDLJASDLJ K DLJSAL JKSADLJ KDSAJLK JLDSAJLK DSA"];
    let todos = names.map((name, index) => {
      let trueOrFalse = Math.random() > 0.5
      let newTodo = {
        name: name,
        id: uuidv4(),
        tags: tags.slice(Math.floor(Math.random() * tags.length)),
        date: randomDate(),
        time: randomTime(),
        completed: trueOrFalse,
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

  //create a random date in YYYY-MM-DD format
  function randomDate() {
    var date;
    if(Math.random() > 0.5){ //50% chance of being in the past
      date = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    } else {
      date = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000));
    }
      
    return date.toISOString().slice(0, 10);
  }

  //create a random time in HH:MM format
  function randomTime() {
    var hours = Math.floor(Math.random() * 24);
    var minutes = Math.floor(Math.random() * 60);
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
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
        { boards.length > 0 ? (
          <div style={{display: "flex", gap: "10px", margin: "10px"}}>
            <input id="todoName" type="text" ref={todoName} onKeyDown={handleKeyDown} placeholder="As a [who], I want [what] so that [why]"></input>
            <input id="tags" type="text" ref={tagsInput} placeholder="Tags, seperated, with, commas"></input>
            <select id="selectBoard" ref={selectedBoard} defaultValue={boards[0]}>
              {boards.map((board, index) => (
                <option key={index} value={board}>{board}</option>
              ))}
            </select>
            <button className="addTodo" onClick={addTodo}>Add Todo</button>
          </div>
        ) : (
          <div>
            <p>Add a board down below!</p>
            <button onClick={addKanbanPreset}>Add kanban preset</button>
            <button onClick={addLargeKanbanPreset}>Add large kanban preset</button>
            <button onClick={stressTestBoard}>Add Stresstest preset</button>
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
      <EditTodoModal />
    </div>
  );
}
