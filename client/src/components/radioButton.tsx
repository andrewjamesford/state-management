import type React from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	containerClassName?: string;
	labelClassName?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
	id,
	name,
	value,
	checked,
	onChange,
	onBlur,
	label,
	className = "",
	containerClassName = "",
	labelClassName = "",
	...props
}) => {
	// If checked is provided but onChange is not, use readOnly prop to avoid the warning
	const inputProps =
		checked !== undefined && !onChange
			? {
					checked,
					readOnly: true,
					...props,
				}
			: {
					...props,
					checked,
					onChange,
				};

	return (
		<div className={`${containerClassName}`}>
			<input
				type="radio"
				id={id}
				name={name}
				value={value}
				onBlur={onBlur}
				{...inputProps}
			/>
			<label htmlFor={id} className={`${labelClassName}`}>
				{label}
			</label>
		</div>
	);
};

export default RadioButton;
