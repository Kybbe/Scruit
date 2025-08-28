import { useCallback, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

export default function ListItemComponent({ todo, index, board }) {
	const dispatch = useDispatch();
	const card = useRef({});
	const todos = useSelector((state) => state.todos);
	const automatedBoardInReducer = useSelector(
		(state) => state.automatedDoneBoard,
	);
	const [overdue, setOverdue] = useState(false);

	function deleteTodo(id) {
		dispatch({ type: "REMOVE_TODO", payload: { id: id, board: board } });
	}

	function completeTodo() {
		const id = todo.id;
		dispatch({ type: "COMPLETE_TODO", payload: { id: id, board: board } });
		if (
			automatedBoardInReducer !== "" &&
			board !== automatedBoardInReducer &&
			todo.completed
		) {
			moveTodo();
		}
	}

	function moveTodo() {
		const todosCopy = { ...todos };

		const todoToMove = todosCopy[board].find(
			(todoInList) => todoInList.id === todo.id,
		);
		todosCopy[board].splice(todosCopy[board].indexOf(todoToMove), 1);
		todosCopy[automatedBoardInReducer].push(todoToMove);

		dispatch({ type: "UPDATE_TODOS", payload: todosCopy });
	}

	function openModal() {
		document.getElementsByClassName("modal")[0].classList.toggle("hidden");
		document
			.getElementsByClassName("modalBackdrop")[0]
			.classList.toggle("hidden");
		dispatch({
			type: "SET_CURRENT_EDIT_TODO",
			payload: { ...todo, board: board },
		});
		openMenu();
	}

	function openMenu() {
		card.current.classList.toggle("menuOpen");
	}

	const isTodoOverdue = useCallback(() => {
		const date = todo.date;
		const time = todo.time;
		let currentDate = new Date();
		currentDate = currentDate.getTime();

		var todoDate = "";

		if (time !== "") {
			todoDate = new Date(`${date} ${time}`);
		} else {
			todoDate = new Date(`${date} 00:00`);
		}
		todoDate = todoDate.getTime();

		if (todoDate < currentDate) {
			setOverdue(true);
		} else {
			setOverdue(false);
		}
	}, [todo.date, todo.time]);

	useEffect(() => {
		isTodoOverdue();
	}, [isTodoOverdue]);

	return (
		<Draggable draggableId={String(todo.id)} key={todo.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="draggable"
				>
					<div className="card" ref={card}>
						<button type="button" className="checkmark" onClick={completeTodo}>
							<svg
								style={
									todo.completed
										? { color: "lime", fill: "lime" }
										: {
												filter: "drop-shadow(2px 4px 6px black)",
												color: "#656565",
												fill: "#656565",
											}
								}
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								aria-label="Checkmark"
							>
								<title>Checkmark</title>
								<path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z" />
							</svg>
						</button>
						<h4 className="todoName">{todo.name}</h4>
						<button type="button" className="openMenu" onClick={openMenu}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								fill="black"
								height="20px"
								width="20px"
								aria-label="Menu"
							>
								<title>Menu</title>
								<path d="M120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200C94.93 200 120 225.1 120 256zM280 256C280 286.9 254.9 312 224 312C193.1 312 168 286.9 168 256C168 225.1 193.1 200 224 200C254.9 200 280 225.1 280 256zM328 256C328 225.1 353.1 200 384 200C414.9 200 440 225.1 440 256C440 286.9 414.9 312 384 312C353.1 312 328 286.9 328 256z" />
							</svg>
						</button>
						<div className="menu">
							<button type="button" onClick={openModal}>
								Edit
							</button>
							<button
								type="button"
								onClick={() => {
									deleteTodo(todo.id);
								}}
							>
								Delete
							</button>
						</div>
						<div className="tags">
							{todo.tags.length > 0
								? todo.tags.map((tag) => {
										//remove spaces from tag
										const tagClass = tag.replace(/[^a-zA-Z0-9]/g, "");
										return (
											<div
												className={`tag ${tagClass.toLowerCase()}`}
												key={tagClass.toLowerCase()}
											>
												{tag}
											</div>
										);
									})
								: ""}
						</div>
						<div
							className="dueDateAndTime"
							style={overdue ? { color: "red" } : {}}
						>
							{todo.date || todo.time ? <p>Due: </p> : ""}
							<div className="dueDate">{todo.date ? todo.date : ""}</div>
							<div className="dueTime">{todo.time ? todo.time : ""}</div>
						</div>
						{/* Checkmark */}
					</div>
				</div>
			)}
		</Draggable>
	);
}
