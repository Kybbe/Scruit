import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import TagColorPicker from "../components/TagColorPicker";
import Adder from "../components/Adder";

export default function Navbar() {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const boards = Object.keys(todos);
  const automatedBoardInReducer = useSelector(state => state.automatedDoneBoard);
  let doneBoardSelect = useRef("");

  useEffect(() => {
    if (boards.length > 0) {
      doneBoardSelect.current.value = automatedBoardInReducer;
    }
  }, [automatedBoardInReducer]);

  function setAutomatedDoneBoard() {
    dispatch({
      type: "SET_AUTOMATED_DONE_BOARD",
      payload: doneBoardSelect.current.value
    });
  }

  useEffect(() => {
    let theme = localStorage.getItem("theme")
    if(theme === "dark") {
      document.body.classList.add("dark-theme")
    } else if(theme !== "light") {
      const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if(userPrefersDark) {
        document.body.classList.add("dark-theme")
      }
    }
  })

  function switchTheme() {
    document.body.classList.toggle("dark-theme")
    let previousTheme = localStorage.getItem("theme");
    if(previousTheme === "dark"){
      localStorage.setItem("theme", "light")
    } else {
      localStorage.setItem("theme", "dark")
    }
  }

  function deleteAll() {
    dispatch({ type: "DELETE_ALL" });
  }

  function openColorPicker() {
    document.getElementsByClassName("colorPickerMenu")[0].classList.toggle("openedColorPicker");
  }
  return (
    <div className="navbar">
      <div className="navbarLeft">
        <button className="themeSwitcher" onClick={switchTheme}>Theme change</button>
        <Adder />
      </div>

      { boards.length > 0 ? (
        <div className="navbarRight">
          <h3>When todos are completed, move too: </h3>
          <select ref={doneBoardSelect} onChange={setAutomatedDoneBoard}> 
            <option value="">Select a board</option>
            {boards.map(board => (
              <option key={board} value={board}>{board}</option>
            ))}
          </select>
          <button className="deleteAll" onClick={deleteAll}>Wipe Boards & Todos</button>
          <button className="openColorPicker" onClick={openColorPicker}>Open Color Picker</button>
          <TagColorPicker />
        </div>
      ) : ""}
    </div>
  );
}