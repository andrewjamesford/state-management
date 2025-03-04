import { Link } from "@tanstack/react-router";

interface LinkComponentProps {
	to: string;
	title: string;
	classes?: string;
}

/**
 * LinkComponent renders a link to navigate to a different page.
 *
 * @param {Object} props - The component props.
 * @param {string} props.to - The URL to navigate to.
 * @param {string} props.title - The text to display in the link.
 * @param {string} [props.classes="text-sm text-gray-600 underline"] - The classes to apply to the link.
 * @returns {JSX.Element} The rendered link.
 */

export function LinkComponent({
	to,
	title,
	classes = "text-sm text-gray-600 underline",
}: LinkComponentProps) {
	return (
		<Link
			to={to}
			className={classes}
			activeProps={{
				className: "font-bold",
			}}
		>
			{title}
		</Link>
	);
}
