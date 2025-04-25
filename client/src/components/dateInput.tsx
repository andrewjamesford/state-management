import type React from "react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	labelClassName?: string;
	errorClassName?: string;
}

export default function DateInput({
	label,
	error,
	labelClassName,
	errorClassName,
	...props
}: DateInputProps) {
	const defaultInputClass =
		"block w-full px-3 py-2 mt-1 border rounded-md text-black focus:ring-primary focus:border-primary focus:bg-transparent placeholder:italic peer";
	const defaultLabelClass = "block text-sm font-medium text-gray-700";
	const defaultErrorClass = "mt-1 text-sm text-red-600";
	return (
		<div>
			{label && (
				<label
					htmlFor={props.id}
					className={labelClassName ?? defaultLabelClass}
				>
					{label}
				</label>
			)}
			<input
				type="date"
				className={props.className ?? defaultInputClass}
				{...props}
			/>
			{error && (
				<span className={errorClassName ?? defaultErrorClass}>{error}</span>
			)}
		</div>
	);
}
