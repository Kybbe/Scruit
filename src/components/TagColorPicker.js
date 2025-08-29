import { useCallback, useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";

export default function TagColorPicker() {
	const dispatch = useDispatch();

	const state = useSelector((state) => state.todos);
	const colorsFromState = useSelector((state) => state.colors);

	const menu = useRef("");
	const rightPane = useRef("");

	const [width, setWidth] = useState(0);
	const [selectedTag, setSelectedTag] = useState("");
	const [color, setColor] = useState("#fe752d");

	const tags = Object.values(state)
		.flat()
		.flatMap((todo) => todo.tags)
		.filter(Boolean);
	const uniqueTags = Array.from(new Set(tags));
	const sortedTags = [...uniqueTags].sort();
	const tagsAsObject = sortedTags.map((tag) => {
		const colorObj = colorsFromState?.find((c) => c.tag === tag);
		return {
			tag,
			color: colorObj ? colorObj.color : "",
		};
	});

	const presetColors = [
		"#FFB5E8",
		"#FF9CEE",
		"#B28DFF",
		"#DCD3FF",
		"#AFF8DB",
		"#C4FAF8",
		"#85E3FF",
		"#BFFCC6",
		"#DBFFD6",
		"#F3FFE3",
		"#FFF5BA",
		"#FFABAB",
		"#FFCBC1",
		"#6f4e37",
	];
	// boards = [[{todo: "asd", id: "asd"}], [{todo: "asd", id: "asd"}, {todo: "asd", id: "asd"}], [{todo: "asd", id: "asd"}]]
	//collpase all todos into one array
	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			setWidth(`${menu.current.clientWidth + 10}px`);
		}
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (selectedTag !== "") {
			rightPane.current.classList.remove("hidden");
		} else {
			rightPane.current.classList.add("hidden");
		}
	}, [selectedTag]);

	function generateRandomColors() {
		const randomColors = [];
		tags.forEach((tag) => {
			randomColors.push({
				tag: tag,
				color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
			});
		});
		dispatch({ type: "SET_COLORS", payload: randomColors });
	}

	function randomPresetColors() {
		const randomColors = [];

		tags.forEach((tag) => {
			randomColors.push({
				tag: tag,
				color:
					presetColors[Math.floor(Math.random() * (presetColors.length - 1))],
			});
		});
		dispatch({ type: "SET_COLORS", payload: randomColors });
	}

	function onComplete() {
		//make tags an array of objects with tag and color
		//loop through tags and find the one that matches the selected tag
		//set the color to that tag's color

		tagsAsObject.forEach((tag) => {
			if (tag.tag === selectedTag) {
				tag.color = color;
			}
		});

		setSelectedTag("");

		dispatch({ type: "SET_COLORS", payload: tagsAsObject });
	}

	function selectTag(tag) {
		setSelectedTag(tag);
	}

	function deselect() {
		setSelectedTag("");
	}

	const addCss = useCallback(() => {
		var sheet;
		var element;
		if (document.getElementsByClassName("tag-color-picker")[0]) {
			sheet = document.getElementsByClassName("tag-color-picker")[0].sheet;
		} else {
			element = document.createElement("style");
			element.classList.add("tag-color-picker");
			document.head.appendChild(element);
			sheet = element.sheet;
		}
		//empty the stylesheet before adding new styles
		while (sheet.cssRules.length > 0) {
			sheet.deleteRule(0);
		}
		tagsAsObject.forEach((tag) => {
			let textStyle = "";
			var textColor = tag.color.substring(1);
			var rgb = parseInt(textColor, 16);
			var r = (rgb >> 16) & 0xff;
			var g = (rgb >> 8) & 0xff;
			var b = (rgb >> 0) & 0xff;
			var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			if (luma > 90 || luma === 0) {
				textStyle = "#000";
			} else {
				textStyle = "#fff";
			}
			const tagName = tag.tag.replace(/[^a-zA-Z0-9]/g, "");
			sheet.insertRule(
				`.${tagName.toLowerCase()} { background-color: ${tag.color}; color: ${textStyle} }`,
				sheet.cssRules.length,
			);
		});
	}, [tagsAsObject]);

	useEffect(() => {
		addCss();
	}, [addCss]);

	function openColorPicker() {
		menu.current.classList.toggle("openedColorPicker");
		rightPane.current.classList.add("hidden");
		setSelectedTag("");
	}

	return (
		<div
			className="colorPickerMenu"
			ref={menu}
			style={{ transform: `translateX(${width})` }}
		>
			<div className="colorPickerMenuLeft" ref={rightPane}>
				<SketchPicker
					color={color}
					presetColors={presetColors}
					disableAlpha
					onChange={(color) => {
						setColor(color.hex);
					}}
				/>
				<button
					type="button"
					onClick={(e) => {
						onComplete();
						e.stopPropagation();
					}}
					className="saveColor"
				>
					Save
				</button>
			</div>
			<div
				type="button"
				className="colorPickerMenuRight"
				onClick={() => {
					setSelectedTag("");
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						openColorPicker();
					}
					if (
						e.key === "Escape" &&
						menu.current.classList.contains("openedColorPicker")
					) {
						openColorPicker();
					}
				}}
			>
				<h1>Tags</h1>
				<p>Click on a tag to edit its color</p>
				<div className="color-picker-tags">
					{tagsAsObject.map(({ tag, color: thisTagsColor }) => {
						let thisTagsTextColor = "";
						var textColor = thisTagsColor.substring(1);
						var rgb = parseInt(textColor, 16);
						var r = (rgb >> 16) & 0xff;
						var g = (rgb >> 8) & 0xff;
						var b = (rgb >> 0) & 0xff;
						var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
						if (luma > 90 || luma === 0) {
							thisTagsTextColor = "#000";
						} else {
							thisTagsTextColor = "#fff";
						}
						return (
							<div
								key={`color-picker-tag-${tag}`}
								onClick={(e) => {
									selectTag(tag);
									e.stopPropagation();
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										selectTag(tag);
										e.stopPropagation();
									}
								}}
								className={`color-picker-tag ${selectedTag === tag ? "selected" : ""}`}
								style={
									selectedTag === tag
										? { color: thisTagsTextColor, backgroundColor: color }
										: {
												color: thisTagsTextColor,
												backgroundColor: thisTagsColor,
											}
								}
							>
								{tag}
							</div>
						);
					})}
					<button
						type="button"
						className="randomizeColors"
						onClick={generateRandomColors}
					>
						Random colors for all tags
					</button>
					<button
						type="button"
						className="randomizeColors"
						onClick={randomPresetColors}
					>
						Random pastel color for all tags
					</button>
					<button type="button" className="deselectTag" onClick={deselect}>
						Deselect
					</button>
				</div>
				<button
					type="button"
					className="closeColorPicker"
					onClick={openColorPicker}
				>
					Close
				</button>
			</div>
		</div>
	);
}
