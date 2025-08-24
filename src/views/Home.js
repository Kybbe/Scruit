import { useRef } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import EditTodoModal from "../components/EditTodoModal";
import ListComponent from "../components/ListComponent";

import Navbar from "./Navbar";

export default function Home() {
	const dispatch = useDispatch();
	const todos = useSelector((state) => state.todos);
	const boards = Object.keys(todos);
	const automatedDoneBoard = useSelector((state) => state.automatedDoneBoard);
	const boardName = useRef("");

	function addBoard() {
		const name = boardName.current.value;
		if (name) {
			dispatch({ type: "ADD_BOARD", payload: name });
			boardName.current.value = "";
		}
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
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
		if (!destination) {
			return;
		} //if the draggable is dropped outside the list, do nothing
		if (destination.droppableId === "TRASH") {
			//if the item is dropped in the trash
			dispatch({
				type: "REMOVE_TODO",
				payload: { board: source.droppableId, id: draggableId },
			});
			return;
		}

		const listCopy = { ...todos }; //copy the list

		const sourceList = listCopy[source.droppableId]; //get the source list, where the draggable was dragged from
		const [removedElement, newSourceList] = removeFromList(
			//remove the draggable from the source list
			sourceList,
			source.index,
		);
		listCopy[source.droppableId] = newSourceList; //set the new source list
		const destinationList = listCopy[destination.droppableId]; //get the destination list, where the draggable was dragged to
		// If dropped into the done board, mark as completed
		let elementToAdd = removedElement;
		if (
			destination.droppableId === automatedDoneBoard &&
			elementToAdd &&
			!elementToAdd.completed
		) {
			elementToAdd = { ...elementToAdd, completed: true };
		}
		listCopy[destination.droppableId] = addToList(
			destinationList,
			destination.index,
			elementToAdd,
		);

		dispatch({ type: "UPDATE_TODOS", payload: listCopy }); //update the state
	}

	return (
		<div className="home">
			<Navbar />

			<DragDropContext onDragEnd={onDragEnd}>
				<div className="boards">
					{boards.map((board, index) => (
						<ListComponent key={board} board={board} index={index} />
					))}
					<div className="addBoard droppable">
						<input
							className="boardNameInput"
							type="text"
							ref={boardName}
							onKeyDown={handleKeyDown}
							placeholder="Board title"
						></input>
						<button type="button" onClick={addBoard}>
							Add Board
						</button>
						{boards.length > 0 &&
							Object.values(todos).some((arr) => arr.length > 0) && (
								<Droppable droppableId={"TRASH"}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											className={
												snapshot.isDraggingOver
													? "droppable trash over-droppable"
													: "droppable trash"
											}
											{...provided.droppableProps}
										>
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							)}
					</div>
				</div>
			</DragDropContext>
			<EditTodoModal />
		</div>
	);
}
