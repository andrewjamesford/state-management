import { Link } from "@tanstack/react-router";

interface LinkComponentProps {
	to: string;
	title: string;
	classes?: string;
}

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
