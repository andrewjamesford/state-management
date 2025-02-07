import type React from "react";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	errorMessage?: string;
	labelClassName?: string;
	inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	label,
	errorMessage,
	labelClassName,
	inputClassName,
	...props
}) => {
	return (
		<div>
			<label
				htmlFor={id}
				className={`${labelClassName || "block text-sm font-medium text-gray-700"}`}
			>
				{label}
			</label>
			<input
				id={id}
				className={`${inputClassName || "mt-1 block w-full rounded-md border px-3 py-2 placeholder:italic"}`}
				{...props}
			/>
			{errorMessage && (
				<span className="mt-1 text-sm text-red-600">{errorMessage}</span>
			)}
		</div>
	);
};

export default TextInput;
