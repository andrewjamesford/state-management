import type { JSX } from "react";
import { LinkComponent } from "./linkComponent";

/**
 * Navigation menu component for authenticated users.
 * Displays links to various forms and a logout button.
 *
 * @param {Object} props
 * @param {() => void} props.onChange - Callback function triggered on logout
 * @returns {JSX.Element} Navigation menu
 */
export default function MenuLoggedIn({
	onChange,
}: { onChange: () => void }): JSX.Element {
	return (
		<ul className="flex list-none flex-col items-center gap-2 md:flex-row md:gap-4">
			<li>
				<LinkComponent to="/single" title="Single Page Form" />
			</li>
			<li>
				<LinkComponent to="/simple" title="Simple Form" />
			</li>
			<li>
				<LinkComponent to="/multi/1" title="Multi Page Form" />
			</li>
			<li>
				<LinkComponent to="/" title="My Sold!" />
			</li>
			<li>
				<button
					type="button"
					onClick={onChange}
					className="text-sm text-gray-600 underline"
				>
					Log out
				</button>
			</li>
		</ul>
	);
}
