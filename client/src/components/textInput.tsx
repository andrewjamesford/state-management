import type React from "react";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	errorMessage?: string;
	labelClassName?: string;
	inputClassName?: string;
	errorClassName?: string;
	requirementsClassName?: string;
	requirementsLabel?: string;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	label,
	errorMessage,
	labelClassName,
	inputClassName,
	errorClassName,
	requirementsClassName,
	requirementsLabel,
	...props
}) => {
	return (
		<div>
			<label htmlFor={id} className={labelClassName}>
				{label}
			</label>
			<input id={id} className={inputClassName} {...props} />
			{errorMessage && (
				<span className={errorClassName} role="alert">
					{errorMessage}
				</span>
			)}
			{requirementsLabel && (
				<p className={requirementsClassName}>{requirementsLabel}</p>
			)}
		</div>
	);
};

export default TextInput;
