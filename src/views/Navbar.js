import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import TagColorPicker from "../components/TagColorPicker";
import Adder from "../components/Adder";

import { v4 as uuidv4 } from 'uuid';

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

  function openRightNavbar() {
    document.getElementsByClassName("navbarRight")[0].classList.toggle("openedRightNavbar");
    document.getElementsByClassName("navbarOpener")[0].classList.toggle("openedRightNavbar");
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

  return (
    <div className="navbar">
      <div className="navbarLeft">
        <button className="themeSwitcher" onClick={switchTheme}>Theme change</button>
        <Adder />
      </div>

      { boards.length <= 0 ? (
        <>
          <div className="navbarRight">
            <button className="presetBtn" onClick={addKanbanPreset}>Add kanban preset</button>
            <button className="presetBtn" onClick={addLargeKanbanPreset}>Add large kanban preset</button>
            <button className="presetBtn" onClick={stressTestBoard}>Add Stresstest preset</button>
          </div>
          <div className="navbarRightOpener">
            <button className="navbarOpener" onClick={openRightNavbar}>⇩</button>
          </div>
        </>
      ) : "" }

      { boards.length > 0 ? (
        <>
          <div className="navbarRight">
            <h3>"Done" board: </h3>
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
          <div className="navbarRightOpener">
            <button className="navbarOpener" onClick={openRightNavbar}>⇩</button>
          </div>
        </>
      ) : ""}
    </div>
  );
}