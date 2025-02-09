import type React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	labelClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
	label,
	labelClassName = "",
	id,
	...props
}) => {
	return (
		<div className="flex items-center">
			<input type="checkbox" id={id} {...props} className="mr-2" />
			{label && (
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
			)}
		</div>
	);
};

export default Checkbox;
