import type React from "react";

interface MoneyTextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	labelClassName?: string;
	errorMessage?: string;
	errorClassName?: string;
}

const MoneyTextInput: React.FC<MoneyTextInputProps> = ({
	label,
	labelClassName = "",
	errorMessage,
	errorClassName = "",
	...props
}) => {
	return (
		<div>
			{label && (
				<label htmlFor={props.id} className={labelClassName}>
					{label}
				</label>
			)}
			<div className="flex">
				<span className="pt-3 pr-2 text-lg">$</span>
				<input
					{...props}
					pattern="^\d+(\.\d{0,2})?$" // allow only digits with optional decimal and up to 2 digits
					className="block w-full px-3 py-2 border rounded-md placeholder:italic"
				/>
			</div>
			{errorMessage && (
				<span className={errorClassName} role="alert">
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export default MoneyTextInput;
