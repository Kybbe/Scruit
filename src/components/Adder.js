import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

export default function Adder() {
	const dispatch = useDispatch();
	const todos = useSelector((state) => state.todos);
	const boards = Object.keys(todos);
	const tagsInput = useRef("");
	const todoName = useRef("");
	const dateInput = useRef("");
	const timeInput = useRef("");
	const selectedBoard = useRef(0);

	const [previewTags, setPreviewTags] = useState([]);

	const [open, setOpen] = useState(false);

	const [greyOutTodo, setGreyOutTodo] = useState(false);
	useEffect(() => {
		if (boards.length === 0) {
			setGreyOutTodo(true);
		} else {
			setGreyOutTodo(false);
		}
	}, [boards]);

	function openContent() {
		if (open) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	}

	function addTodo() {
		const name = todoName.current.value;
		let tags = tagsInput.current.value;
		const date = dateInput.current.value;
		const time = timeInput.current.value;

		// make tags a array of strings split by ", "
		tags = tags.split(", ");
		if (tags.length > 0 && tags[tags.length - 1] === "") {
			tags.pop(); // remove last tag if it is empty
		}
		tags.forEach((tag) => {
			if (tag === "") {
				alert("Please have atleast one letter or number in each tag");
				return;
			}
			// if first charachter in tag is a number, remove it
			if (/^\d/.test(tag)) {
				tag = tag.substring(1);
			}
		});
		if (tags[0] === "") {
			tags = [];
		}
		if (name) {
			//find board by board.id, and make todo.order equal to the length of that board's todos array
			const newTodo = {
				name: name,
				id: uuidv4(),
				tags: tags,
				date: date,
				time: time,
				completed: false,
			};

			dispatch({
				type: "ADD_TODO",
				payload: { name: selectedBoard.current.value, todo: newTodo },
			});
			todoName.current.value = "";
		}
	}

	function updatePreviewTags() {
		const tagsText = tagsInput.current.value;
		const tags = tagsText.split(", ");
		tags.forEach((tag) => {
			if (tag === "") {
				tags.splice(tags.indexOf(tag), 1);
			}
		});
		setPreviewTags(tags);
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") {
			if (e.target.id === "todoName") {
				addTodo();
			}
		}
		if (e.key === "Escape" && open) {
			setOpen(false);
		}
	}

	return (
		<div className="adder">
			<button type="button" className="adderBtn" onClick={openContent}>
				<h1>+</h1>
			</button>
			<div
				className="adderContent"
				style={open ? { display: "block" } : { display: "none" }}
			>
				<div className="adderAddTodo">
					<input
						disabled={greyOutTodo}
						style={
							greyOutTodo
								? { opacity: "0.3", backgroundColor: "lightgrey" }
								: {}
						}
						className="todoNameAdderInput"
						type="text"
						ref={todoName}
						onKeyDown={handleKeyDown}
						placeholder="As a [who], I want [what] so that [why]"
					></input>
					<input
						disabled={greyOutTodo}
						style={
							greyOutTodo
								? { opacity: "0.3", backgroundColor: "lightgrey" }
								: {}
						}
						className="tagsAdderInput"
						type="text"
						ref={tagsInput}
						onChange={updatePreviewTags}
						placeholder="Tags, seperated, with, commas"
					></input>
					<div
						className="previewTags"
						style={previewTags.length <= 0 ? { display: "none" } : {}}
					>
						{previewTags.length > 0
							? previewTags.map((tag) => {
									//remove spaces from tag
									const tagClass = tag.replace(/[^a-zA-Z0-9]/g, "");
									return (
										<div
											className={`tag ${tagClass.toLowerCase()}`}
											key={tagClass}
										>
											{tag}
										</div>
									);
								})
							: ""}
					</div>
					<div
						className="adderDateAndTime"
						style={
							greyOutTodo
								? { opacity: "0.3", backgroundColor: "lightgrey" }
								: {}
						}
					>
						<p className="dueTextAdder">Due: </p>
						<div className="adderDate">
							<input
								disabled={greyOutTodo}
								style={greyOutTodo ? { backgroundColor: "lightgrey" } : {}}
								ref={dateInput}
								type="date"
								placeholder="Date"
							></input>
						</div>
						<div className="adderTime">
							<input
								disabled={greyOutTodo}
								style={greyOutTodo ? { backgroundColor: "lightgrey" } : {}}
								ref={timeInput}
								type="time"
								placeholder="Time"
							></input>
						</div>
					</div>
					<select
						disabled={greyOutTodo}
						style={
							greyOutTodo
								? { opacity: "0.3", backgroundColor: "lightgrey" }
								: {}
						}
						ref={selectedBoard}
						defaultValue={boards[0]}
					>
						{boards.map((board) => (
							<option key={board} value={board}>
								{board}
							</option>
						))}
					</select>
					<button
						type="button"
						disabled={greyOutTodo}
						style={
							greyOutTodo
								? {
										opacity: "0.3",
										backgroundColor: "lightgrey",
										cursor: "default",
									}
								: {}
						}
						className="addTodo"
						onClick={addTodo}
					>
						Add Todo
					</button>
				</div>
			</div>
		</div>
	);
}
