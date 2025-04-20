interface SubmitButtonProps {
	onClick?: () => void;
	disabled?: boolean;
	isLoading?: boolean;
	children?: React.ReactNode;
}

export default function SubmitButton({
	onClick,
	disabled = false,
	isLoading = false,
	children = "Save",
}: SubmitButtonProps) {
	return (
		<button
			type="submit"
			onClick={onClick}
			disabled={disabled || isLoading}
			className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 hover:bg-blue-600 text-white hover:bg-primary/90 h-10 px-4 py-2"
		>
			{isLoading ? (
				<span className="flex items-center">
					<svg
						className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<title>Loading...</title>
						<desc>A spinner icon indicating loading state</desc>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Saving...
				</span>
			) : (
				children
			)}
		</button>
	);
}
