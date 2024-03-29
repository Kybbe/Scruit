import ListItem from './ListItemComponent';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {ReactComponent as TrashCan} from '../trashcan.svg';

export default function ListComponent({board, index}) {

  const boards = useSelector(state => state.todos);
  const todosInBoard = boards[board];
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const listHeader = useRef(null)

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setHeight((listHeader.current.clientHeight + 10) + "px")
      setWidth(window.innerWidth)
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  function collapseDroppable() {
    if(width <= 500) {
      if(collapsed) {
        setCollapsed(false)
      } else {
        setCollapsed(true)
      }
    }
  }
  
  return (
    <div className='droppableContainer'>
      <div ref={listHeader} onClick={ collapseDroppable } style={width >= 501 ? {maxWidth: "280px"} : undefined}>
        <p className='boardCounter'>{todosInBoard.length}</p>
        <h2 className='boardTitle'>{board}</h2>
        <button 
          className='boardDeleter' 
          onClick={(e) => {dispatch({type: "REMOVE_BOARD", payload: board}); e.stopPropagation()}}>
            <TrashCan />
        </button>
      </div>
      <Droppable droppableId={board}>
        {(provided, snapshot) => (
          <div
          ref={provided.innerRef}
          className={snapshot.isDraggingOver ? "droppable over-droppable" : "droppable"}
          style={collapsed ? {height: "0", minHeight: "0", overflow: "hidden"} : {height: "calc(100% - " + height +")"}}
          {...provided.droppableProps}
          >
            {todosInBoard.map((todo, index) => (
              <ListItem key={todo.id} todo={todo} index={index} board={board}/>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}