import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { v4 as uuidv4 } from 'uuid';

export default function Adder() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const boards = Object.keys(todos);
  const tagsInput = useRef("");
  const todoName = useRef("")
  const boardName = useRef("")
  const selectedBoard = useRef(0)
  
  const [open, setOpen] = useState(false);
  
  const [greyOutTodo, setGreyOutTodo] = useState(false);
  useEffect(() => {
    if( boards.length === 0 ) {
      setGreyOutTodo(true);
    } else {
      setGreyOutTodo(false);
    }
  }, [boards]);

  function openContent() {
    if(open) {
      setOpen(false);
    }
    else {
      setOpen(true);
    }
  }

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

  return (
    <div className="adder">
      <div className="adderBtn" onClick={openContent}>
        <h1>+</h1>
      </div>
      <div className="adderContent" style={open ? {display: "block"} : {display: "none"}}>
        <div className="adderAddBoard">
          <input id="boardName" type="text" ref={boardName} onKeyDown={handleKeyDown} placeholder="Board title"></input>
          <button onClick={addBoard}>Add Board</button>
        </div>
        <div className="adderAddTodo">
          <input disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}} id="todoName" type="text" ref={todoName} onKeyDown={handleKeyDown} placeholder="As a [who], I want [what] so that [why]"></input>
          <input disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}} id="tags" type="text" ref={tagsInput} placeholder="Tags, seperated, with, commas"></input>
          <select disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}} ref={selectedBoard} defaultValue={boards[0]}>
            {boards.map((board, index) => (
              <option key={index} value={board}>{board}</option>
            ))}
          </select>
          <button className="addTodo" onClick={addTodo}>Add Todo</button>
        </div>
      </div>

      <style jsx>{`
        .adderContent {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 4.5em;
          left: 10px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 4px 4px 8px rgba(0,0,0,0.3);
          z-index: 2;
          padding-top: 10px;
          min-width: 22em;
        }

        .adderBtn h1 {
          font-size: 2em;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          line-height: 1.5em;
          margin: 0;
        }

        .adderBtn {
          cursor: pointer;
          position: fixed;
          top: 25px;
          left: 10px;
          z-index: 2;
          height: 2em;
          width: 2em;
          line-height: 1em;
          text-align: center;
        }

        .adderContent button {
          width: calc(100% - 20px);
          margin: 10px;
          background-color: black;
          color: white;
          border-radius: 5px;
          padding: 10px;
          font-size: 1.2em;
          border: none;
          box-sizing: border-box;
        }

        .adderAddBoard {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid grey;
        }

        .adderAddTodo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .adderAddTodo input, .adderAddBoard input, .adderAddTodo select {
          width: 100%;
          box-sizing: border-box;
          border: none;
          border-bottom: 1px solid lightgrey;
          padding: 10px;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  );
}
