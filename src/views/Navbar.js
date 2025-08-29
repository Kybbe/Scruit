import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Adder from "../components/Adder";
import TagColorPicker from "../components/TagColorPicker";

export default function Navbar() {
	const dispatch = useDispatch();
	const todos = useSelector((state) => state.todos);
	const boards = Object.keys(todos);
	const automatedBoardInReducer = useSelector(
		(state) => state.automatedDoneBoard,
	);
	const doneBoardSelect = useRef("");

	const [tagColorPickerOpen, setTagColorPickerOpen] = useState(false);

	function openColorPicker() {
		setTagColorPickerOpen(true);
	}

	function closeColorPicker() {
		setTagColorPickerOpen(false);
	}

	useEffect(() => {
		if (boards.length > 0) {
			doneBoardSelect.current.value = automatedBoardInReducer;
		}
	}, [automatedBoardInReducer, boards.length]);

	function setAutomatedDoneBoard() {
		dispatch({
			type: "SET_AUTOMATED_DONE_BOARD",
			payload: doneBoardSelect.current.value,
		});
	}

	useEffect(() => {
		const theme = localStorage.getItem("theme");
		if (theme === "dark") {
			document.body.classList.add("dark-theme");
		} else if (theme !== "light") {
			const userPrefersDark = window.matchMedia?.(
				"(prefers-color-scheme: dark)",
			).matches;

			if (userPrefersDark) {
				document.body.classList.add("dark-theme");
			}
		}
	});

	function switchTheme() {
		document.body.classList.toggle("dark-theme");
		const previousTheme = localStorage.getItem("theme");
		if (previousTheme === "dark") {
			localStorage.setItem("theme", "light");
		} else {
			localStorage.setItem("theme", "dark");
		}
	}

	function openRightNavbar() {
		document
			.getElementsByClassName("navbarRight")[0]
			.classList.toggle("openedRightNavbar");
		document
			.getElementsByClassName("navbarOpener")[0]
			.classList.toggle("openedRightNavbar");
	}

	function deleteAll() {
		dispatch({ type: "DELETE_ALL" });
	}

	return (
		<div className="navbar">
			<div className="navbarLeft">
				<button type="button" className="themeSwitcher" onClick={switchTheme}>
					Theme change
				</button>
				<Adder />

				<p>Version: 1.1.0</p>
			</div>

			{boards.length <= 0 && (
				<div className="navbarRightOpener">
					<button
						type="button"
						className="navbarOpener"
						onClick={openRightNavbar}
					>
						⇩
					</button>
				</div>
			)}

			{boards.length > 0 ? (
				<>
					<div className="navbarRight">
						<h3>"Done" board: </h3>
						<select ref={doneBoardSelect} onChange={setAutomatedDoneBoard}>
							<option value="">Select a board</option>
							{boards.map((board) => (
								<option key={board} value={board}>
									{board}
								</option>
							))}
						</select>
						<button type="button" className="deleteAll" onClick={deleteAll}>
							Wipe Boards & Todos
						</button>
						<button
							type="button"
							className="openColorPicker"
							onClick={openColorPicker}
						>
							Open Color Picker
						</button>
						<TagColorPicker
							open={tagColorPickerOpen}
							onClose={closeColorPicker}
						/>
					</div>
					<div className="navbarRightOpener">
						<button
							type="button"
							className="navbarOpener"
							onClick={openRightNavbar}
						>
							⇩
						</button>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
}
