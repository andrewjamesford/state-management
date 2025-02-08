import type React from "react";
import { useState } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	selectClassName?: string;
	label?: string;
	labelClassName?: string;
	errorMessage?: string;
	errorMessageClassName?: string;
}

const Select: React.FC<SelectProps> = ({
	selectClassName = "",
	label,
	labelClassName = "",
	children,
	onChange,
	errorMessage,
	errorMessageClassName,
	...props
}) => {
	const [selectedText, setSelectedText] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const text = e.target.options[e.target.selectedIndex].text;
		setSelectedText(text);
		if (onChange) onChange(e);
	};

	return (
		<>
			{label && (
				<label htmlFor={props.id} className={labelClassName}>
					{label}
				</label>
			)}

			<select {...props} onChange={handleChange} className={selectClassName}>
				{children}
			</select>

			<span className={errorMessageClassName} role="alert">
				{errorMessage}
			</span>
		</>
	);
};

export default Select;
