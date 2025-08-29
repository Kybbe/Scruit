import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import MinimalInput from "./MinimalInput";

export default function Adder() {
	const dispatch = useDispatch();
	const todos = useSelector((state) => state.todos);
	const boards = Object.keys(todos);
	const [info, setInfo] = useState({
		name: "",
		tags: "",
		date: "",
		time: "",
		selectedBoard: boards.length > 0 ? boards[0] : "",
	});

	const [previewTags, setPreviewTags] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (boards.length > 0 && !boards.includes(info.selectedBoard)) {
			setInfo({ ...info, selectedBoard: boards[0] });
		}
	}, [boards, info]);

	function openCloseContent() {
		if (open) {
			setOpen(false);
			document
				.getElementsByClassName("modalBackdrop")[0]
				.classList.add("hidden");
		} else {
			setOpen(true);
			document
				.getElementsByClassName("modalBackdrop")[0]
				.classList.remove("hidden");
		}
	}

	function addTodo() {
		const { name, tags: tagInfo, date, time } = info;
		console.log("addtodo", info);

		// make tags a array of strings split by ", "
		let tags = tagInfo.split(",");
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
			tag = tag.trim();
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
				payload: { name: info.selectedBoard, todo: newTodo },
			});
			setInfo({
				...info,
				name: "",
				tags: "",
				date: "",
				time: "",
			});
			setPreviewTags([]);
		} else {
			alert("Please enter a todo name");
		}
	}

	function updatePreviewTags(newTagsText) {
		const tags = newTagsText.split(",");
		tags.forEach((tag) => {
			if (tag === "") {
				tags.splice(tags.indexOf(tag), 1);
			}
		});
		setPreviewTags(tags);
	}

	return (
		<div
			className="adder"
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					openCloseContent();
				}
			}}
		>
			{boards.length > 0 && (
				<button type="button" className="adderBtn" onClick={openCloseContent}>
					+
				</button>
			)}
			<div
				className="adderContent"
				style={open ? { display: "block" } : { display: "none" }}
			>
				<div className="adderAddTodo">
					<MinimalInput
						value={info.name}
						onChange={(e) => {
							setInfo({ ...info, name: e.target.value });
						}}
						label="Todo Name"
						placeholder="As a [who], I want [what] so that [why]"
						required
					/>
					<MinimalInput
						value={info.tags}
						onChange={(e) => {
							setInfo({ ...info, tags: e.target.value });
							updatePreviewTags(e.target.value);
						}}
						label="Tags"
						placeholder="Tags, seperated, with, commas"
					/>

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

					<div className="adderDateAndTime">
						<p className="dueTextAdder">Due: </p>
						<div className="adderDate">
							<input
								type="date"
								placeholder="Date"
								value={info.date}
								onChange={(e) => {
									setInfo({ ...info, date: e.target.value });
								}}
							></input>
						</div>
						<div className="adderTime">
							<input
								type="time"
								placeholder="Time"
								value={info.time}
								onChange={(e) => {
									setInfo({ ...info, time: e.target.value });
								}}
							></input>
						</div>
					</div>
					<select
						defaultValue={boards[0]}
						value={info.selectedBoard}
						onChange={(e) => {
							setInfo({ ...info, selectedBoard: e.target.value });
						}}
					>
						{boards.map((board) => (
							<option key={board} value={board}>
								{board}
							</option>
						))}
					</select>
					<button
						type="button"
						disabled={boards.length === 0 || info.name === ""}
						style={
							boards.length === 0 || info.name === ""
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

			<button
				type="button"
				onClick={openCloseContent}
				className="modalBackdrop hidden"
			/>
		</div>
	);
}
