import type React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	selectClassName?: string;
	label?: string;
	labelClassName?: string;
	errorMessage?: string;
	errorMessageClassName?: string;
	options?: {
		value: string | number;
		label: string;
		className?: string;
		disabled?: boolean;
	}[];
}

const Select: React.FC<SelectProps> = ({
	selectClassName = "",
	label,
	labelClassName = "",
	onChange,
	errorMessage,
	errorMessageClassName,
	options = [],
	...props
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
				{options.map((o) => (
					<option
						key={o.value}
						value={o.value}
						className={o.className}
						disabled={o.disabled}
					>
						{o.label}
					</option>
				))}
			</select>

			<span className={errorMessageClassName} role="alert">
				{errorMessage}
			</span>
		</>
	);
};

export default Select;
