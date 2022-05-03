import ListItem from './ListItemComponent';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {ReactComponent as TrashCan} from '../trashcan.svg';

export default function ListComponent({board, index}) {

  const boards = useSelector(state => state.todos);
  const todosInBoard = boards[board];
  const dispatch = useDispatch();
  
  return (
    <div className='droppableContainer'>
      <p className='boardCounter'>{todosInBoard.length}</p>
      <h2 className='boardTitle'>{board}</h2>
      <button 
        className='boardDeleter' 
        onClick={() => {dispatch({type: "REMOVE_BOARD", payload: board})}}>
          <TrashCan />
      </button>
      <Droppable droppableId={board}>
        {(provided, snapshot) => (
          <div
          ref={provided.innerRef}
          className={snapshot.isDraggingOver ? "droppable over-droppable" : "droppable"}
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