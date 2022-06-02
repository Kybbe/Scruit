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
  
  const [previewTags, setPreviewTags] = useState([]);
  
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

  function updatePreviewTags() {
    let tagsText = tagsInput.current.value;
    let tags = tagsText.split(", ");
    tags.forEach(tag => {
      if(tag === "") {
        tags.splice(tags.indexOf(tag), 1);
      }
    });
    setPreviewTags(tags);
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
          <input disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}} id="tags" type="text" ref={tagsInput} onChange={updatePreviewTags} placeholder="Tags, seperated, with, commas"></input>
          <div className="previewTags" style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}}>
            {previewTags.length > 0 ? 
              previewTags.map((tag, index) => {
                //remove spaces from tag
                let tagClass = tag.replace(/\s/g, '');
                return (
                  <div className={"tag " + tagClass.toLowerCase()} key={index}>
                    {tag}
                  </div>
                )
              })
              : ""
            }
          </div>
          <select disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey"} : {}} ref={selectedBoard} defaultValue={boards[0]}>
            {boards.map((board, index) => (
              <option key={index} value={board}>{board}</option>
            ))}
          </select>
          <button disabled={greyOutTodo} style={greyOutTodo ? {opacity: "0.3", backgroundColor: "lightgrey", cursor: "default"} : {}} className="addTodo" onClick={addTodo}>Add Todo</button>
        </div>
      </div>

      <style jsx>{`
        .adderContent {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 4.5em;
          left: 10px;
          background-color: var(--background);
          border-radius: 10px;
          box-shadow: 0px 0px 16px rgba(0,0,0,0.3);
          z-index: 2;
          padding-top: 10px;
          min-width: 22em;
          max-width: 40vw;
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
          background-color: var(--textColor);
          color: var(--background);
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
          border-bottom: 1px solid var(--borderColor);
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
          border-bottom: 1px solid var(--borderColor);
          padding: 10px;
          font-size: 1.2em;
        }

        .previewTags {
          display: flex;
          border-bottom: 1px solid var(--borderColor);
          min-width: 100%;
          overflow-x: scroll;
        }

        .previewTags * {
          flex-shrink: 0;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
