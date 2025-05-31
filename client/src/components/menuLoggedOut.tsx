/**
 * MenuLoggedOut component renders a list with a single button for logging in.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onChange - The function to call when the button is clicked.
 * @returns {JSX.Element} The rendered component.
 */
export default function MenuLoggedOut({ onChange }: { onChange: () => void }) {
	return (
		<ul className="flex list-none flex-col items-center gap-2 md:flex-row md:gap-4">
			<li>
				<button
					type="button"
					onClick={onChange}
					className="text-sm text-gray-600 underline"
				>
					Log In
				</button>
			</li>
		</ul>
	);
}
