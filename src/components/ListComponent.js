import ListItem from './ListItemComponent';
import { Droppable } from 'react-beautiful-dnd';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {ReactComponent as TrashCan} from '../trashcan.svg';

export default function ListComponent({board, index, listWidth}) {

  const todos = useSelector(state => state.todos);
  //filter todos into several arrays based on board id
  const todosInBoard = todos.filter(todo => todo.boardId - 1 === board.id);
  const dispatch = useDispatch();
  
  return (
    <div className='droppableContainer'>
      <p className='boardCounter'>{todosInBoard.length}</p>
      <h2 className='boardTitle'>{board.title}</h2>
      <button 
        className='boardDeleter' 
        onClick={() => {dispatch({type: "REMOVE_BOARD", payload: board.id})}}>
          <TrashCan />
      </button>
      <Droppable droppableId={"droppable-" + index}>
        {(provided, snapshot) => (
          <div
          ref={provided.innerRef}
          className={snapshot.isDraggingOver ? "droppable over-droppable" : "droppable"}
          {...provided.droppableProps}
          >
            {todosInBoard.map(todo => (
              <ListItem key={todo.id} todo={todo} index={todo.id}/>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}