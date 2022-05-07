import { useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from "react-redux";

export default function ListItemComponent({todo, index, board}) {

  const dispatch = useDispatch();
  const card = useRef({});

  function deleteTodo(id) {
    dispatch({ type: "REMOVE_TODO", payload: {id: id, board: board} });
  }
  
  function openModal() {
    document.getElementsByClassName('modal')[0].classList.toggle('hidden');
    document.getElementsByClassName('modalBackdrop')[0].classList.toggle('hidden');
    dispatch({ type: "SET_CURRENT_EDIT_TODO", payload: {name: todo.name, id: todo.id, board: board, tags: todo.tags} });
    openMenu();
  }

  function openMenu() {
    card.current.classList.toggle("menuOpen");
  }

  return (
    <Draggable draggableId={String(todo.id)} key={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="draggable"
        >
          <div className='card' ref={card}>
            <h4 className='todoName'>{todo.name}</h4>
            <button className='openMenu' onClick={openMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='black' height="20px" width="20px"><path d="M120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200C94.93 200 120 225.1 120 256zM280 256C280 286.9 254.9 312 224 312C193.1 312 168 286.9 168 256C168 225.1 193.1 200 224 200C254.9 200 280 225.1 280 256zM328 256C328 225.1 353.1 200 384 200C414.9 200 440 225.1 440 256C440 286.9 414.9 312 384 312C353.1 312 328 286.9 328 256z"/></svg>
            </button>
            <div className='menu'>
              <button onClick={openModal}>Edit</button>
              <button onClick={() => {deleteTodo(todo.id)}}>Delete</button>
            </div>
            <div className='tags'>
            {todo.tags.length > 0 ? 
              todo.tags.map((tag, index) => {
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
            {/* Checkmark */}
            {/* Tags */}
          </div>
        </div>
      )}
    </Draggable>
  )
}