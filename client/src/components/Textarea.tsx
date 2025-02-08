import type React from "react";

interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	labelClassName?: string;
	errorMessage?: string;
	errorClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
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
			<textarea {...props} />
			{errorMessage && (
				<span className={errorClassName} role="alert">
					{errorMessage}
				</span>
			)}
		</div>
	);
};

export default Textarea;
