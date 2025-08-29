import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

export default function PresetBoardButtons() {
	const dispatch = useDispatch();

	function randomDate() {
		var date;
		if (Math.random() > 0.5) {
			date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
		} else {
			date = new Date(Date.now() + Math.floor(Math.random() * 10000000000));
		}
		return date.toISOString().slice(0, 10);
	}

	function randomTime() {
		var hours = Math.floor(Math.random() * 24);
		var minutes = Math.floor(Math.random() * 60);
		return `${(`0${hours}`).slice(-2)}:${(`0${minutes}`).slice(-2)}`;
	}

	async function addKanbanPreset() {
		await dispatch({ type: "ADD_BOARD", payload: "To Do" });
		await dispatch({ type: "ADD_BOARD", payload: "In Progress" });
		await dispatch({ type: "ADD_BOARD", payload: "Done" });
		const names = [
			"Buy coffee",
			"Brew coffee",
			"Drink coffee",
			"Eat coffee",
			"Sleep",
		];
		const todos = names.map((name) => {
			const trueOrFalse = Math.random() > 0.5;
			const newTodo = {
				name: name,
				id: uuidv4(),
				tags: ["coffee"],
				date: randomDate(),
				time: randomTime(),
				completed: trueOrFalse,
			};
			return newTodo;
		});
		todos.forEach((todo) => {
			dispatch({ type: "ADD_TODO", payload: { name: "To Do", todo: todo } });
		});
	}

	async function addLargeKanbanPreset() {
		const boardNames = [
			"To Do",
			"Backlog",
			"Sprint backlog",
			"In Progress",
			"Testing",
			"Needs to be deployed",
			"Done",
		];
		boardNames.forEach((name) => {
			dispatch({ type: "ADD_BOARD", payload: name });
		});
		const names = [
			"Buy coffee",
			"Brew coffee",
			"Drink coffee",
			"Eat coffee",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
		];
		const tags = ["Coffee", "Code", "Game", "Form", "Register", "Stuff"];
		const todos = names.map((name) => {
			const trueOrFalse = Math.random() > 0.5;
			const newTodo = {
				name: name,
				id: uuidv4(),
				tags: tags.slice(Math.floor(Math.random() * tags.length)),
				date: randomDate(),
				time: randomTime(),
				completed: trueOrFalse,
			};
			const randomBoard = Math.floor(Math.random() * boardNames.length);
			return { name: boardNames[randomBoard], todo: newTodo };
		});
		todos.forEach((todo) => {
			dispatch({
				type: "ADD_TODO",
				payload: { name: todo.name, todo: todo.todo },
			});
		});
	}

	async function stressTestBoard() {
		const boardNames = [
			"ASDASDASDASDASDASDADS",
			"asdASDJKL ASDjl ASDljkADSLJK ADS JL",
			"3",
			"!,.()/{} [] sdasjkl ,  , m mas mads",
			"ASJL ASJK LASDLJ KDSJLK AJ KLDSAJLK ADSJLK DASJLKDJLK ASJL KDASLJK DSALJK DASJLKDLJS KAALDSJ LJ KDSAL JKDSA",
		];
		boardNames.forEach((name) => {
			dispatch({ type: "ADD_BOARD", payload: name });
		});
		const names = [
			"ASLDKJASLDKJASLDKLJASDL KASLJ DKL JASL JKDASJKL L JKDALS JDSLJ ALJ KADSAKLJ SKJLJL AKSDL JKSADJL KSL JKLJ KDASLJ KDSA",
			"ASDJASDJASDKJHASKDJHASKDJHASKDJAKSDJHAKSDJHKAJHSD",
			"3",
			"!;?=)(/&%€#{}{}{}}[[][]][|§|[]≈±≈][|§∞$£¥¢‰}≠¿",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
			"Sleep",
			"Code",
			"Game",
			"Add form to login",
			"Register old users",
			"asd",
			"Stuff",
			"3",
		];
		const tags = [
			"Coffee",
			"Code",
			"Game",
			"Form",
			"Register",
			"NKO)(/&%TYUIO}{Ü][|˜Ü{üº¬ºﬂ·",
			")J!)(F2e9ukf29ne9wef827J/KU)IJK=AS?DP",
			"Stuff",
			"HBNKIUYGJKIUHAKSDJALSHALKSDJLASKJDLASKJDALSKD",
			"AJ KLSDLJASDLJ K DLJSAL JKSADLJ KDSAJLK JLDSAJLK DSA",
		];
		const todos = names.map((name) => {
			const trueOrFalse = Math.random() > 0.5;
			const newTodo = {
				name: name,
				id: uuidv4(),
				tags: tags.slice(Math.floor(Math.random() * tags.length)),
				date: randomDate(),
				time: randomTime(),
				completed: trueOrFalse,
			};
			const randomBoard = Math.floor(Math.random() * boardNames.length);
			return { name: boardNames[randomBoard], todo: newTodo };
		});
		todos.forEach((todo) => {
			dispatch({
				type: "ADD_TODO",
				payload: { name: todo.name, todo: todo.todo },
			});
		});
	}

	return (
		<div className="navbarRight">
			<button type="button" className="presetBtn" onClick={addKanbanPreset}>
				Add kanban preset
			</button>
			<button
				type="button"
				className="presetBtn"
				onClick={addLargeKanbanPreset}
			>
				Add large kanban preset
			</button>
			<button type="button" className="presetBtn" onClick={stressTestBoard}>
				Add Stresstest preset
			</button>
		</div>
	);
}
