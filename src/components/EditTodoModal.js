import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditTodoModal() {
	const dispatch = useDispatch();
	const newTodoName = useRef("");
	const todoId = useRef("");
	const newTags = useRef("");
	const newDate = useRef("");
	const newTime = useRef("");

	const currentEditTodo = useSelector((state) => state.currentEditTodo);

	useEffect(() => {
		if (currentEditTodo) {
			newTodoName.current.value = currentEditTodo.name;
			todoId.current.value = currentEditTodo.id;
			newDate.current.value = currentEditTodo.date;
			newTime.current.value = currentEditTodo.time;
		}
	}, [currentEditTodo]);

	useEffect(() => {
		if (currentEditTodo === undefined) {
			return;
		}
		if (currentEditTodo.tags) {
			newTags.current.value = currentEditTodo.tags.join(", ");
		}
	}, [currentEditTodo]);

	function editTodo() {
		const name = newTodoName.current.value;
		const id = currentEditTodo.id;
		const board = currentEditTodo.board;
		const tags = newTags.current.value.split(", ");
		const date = newDate.current.value;
		const time = newTime.current.value;
		if (name) {
			dispatch({
				type: "UPDATE_TODO",
				payload: {
					id: id,
					name: name,
					board: board,
					tags: tags,
					date: date,
					time: time,
				},
			});
			newTodoName.current.value = "";
			todoId.current.value = "";
			newTags.current.value = "";
			newDate.current.value = "";
			newTime.current.value = "";
			document.getElementsByClassName("modal")[0].classList.toggle("hidden");
			document
				.getElementsByClassName("modalBackdrop")[0]
				.classList.toggle("hidden");
		} else {
			alert("Please enter a name");
		}
	}

	function closeModal() {
		document.getElementsByClassName("modal")[0].classList.toggle("hidden");
		document
			.getElementsByClassName("modalBackdrop")[0]
			.classList.toggle("hidden");
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			editTodo();
		}
	}

	return (
		<div className="editTodoModal">
			<div className="modal hidden">
				{currentEditTodo ? (
					<>
						<h2>Edit Todo</h2>
						<input
							className="newTodoName"
							type="text"
							ref={newTodoName}
							onKeyDown={handleKeyDown}
						></input>
						<input className="newTodoId" ref={todoId} disabled></input>
						<input
							className="newTags"
							ref={newTags}
							onKeyDown={handleKeyDown}
						></input>
						<input className="newDate" ref={newDate} type="date"></input>
						<input
							className="newTime"
							ref={newTime}
							type="time"
							onKeyDown={handleKeyDown}
						></input>
						<button type="button" onClick={editTodo}>
							Save
						</button>
						<button type="button" className="closeModal" onClick={closeModal}>
							X
						</button>
					</>
				) : (
					""
				)}
			</div>
			<div className="modalBackdrop hidden"></div>
		</div>
	);
}
