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
	return (
		<div className={`${containerClassName}`}>
			<input
				type="radio"
				id={id}
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				onBlur={onBlur}
				{...props}
			/>
			<label htmlFor={id} className={`${labelClassName}`}>
				{label}
			</label>
		</div>
	);
};

export default RadioButton;
