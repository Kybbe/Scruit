import { useEffect, useState } from "react";
import "./MinimalInput.css";

export default function MinimalInput({
	value,
	onChange,
	label,
	placeholder,
	status,
	required,
	disabled,
	onKeyDown,
}) {
	const [focused, setFocused] = useState(false);
	const [hasEverFocused, setHasEverFocused] = useState(false);
	const inputId = `minimal-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

	// Determine status class
	let statusClass = "";
	if (status === "success") statusClass = " success";
	if (status === "error") statusClass = " error";

	// Required logic
	const showRequiredError = required && !focused && !value && hasEverFocused;
	if (showRequiredError) statusClass = " error";

	useEffect(() => {
		//if value suddenly is blank, reset hasEverFocused
		if (!value) {
			setHasEverFocused(false);
		}
	}, [value]);

	return (
		<div
			className={`minimal-input-wrapper${focused ? " focused" : ""}${statusClass}`}
		>
			<label
				htmlFor={inputId}
				className={`minimal-input-label${focused || value ? " lifted" : ""}`}
			>
				{label}
				{required ? (
					<span style={{ color: showRequiredError ? "red" : undefined }}>
						*
					</span>
				) : null}
			</label>
			<input
				id={inputId}
				className="minimal-input"
				value={value}
				onChange={onChange}
				onFocus={() => {
					setFocused(true);
					setHasEverFocused(true);
				}}
				onBlur={() => setFocused(false)}
				placeholder={focused ? placeholder : ""}
				autoComplete="off"
				disabled={!!disabled}
				readOnly={!!disabled}
				aria-required={!!required}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
}
