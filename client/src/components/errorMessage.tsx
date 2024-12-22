/**
 * ErrorMessage component displays an error message in a styled alert box.
 *
 * @param {Object} props - The component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} The rendered error message component.
 */
interface ErrorMessageProps {
	message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
	return (
		<div
			className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
			role="alert"
		>
			<p className="font-bold">Error</p>
			<p>{message}</p>
		</div>
	);
}
