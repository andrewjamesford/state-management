/**
 * Loader component for displaying a loading animation.
 *
 * @param {Object} props - The component props.
 * @param {number} [props.width=10] - The width of the loading animation.
 * @param {number} [props.height=10] - The height of the loading animation.
 * @returns {JSX.Element} The Loader component.
 */
export default function Loader({ width = 10, height = 10 }) {
	return (
		<div className="min-h-10 w-full flex justify-center items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				aria-label="Loading Animation"
				className=" animate-spin text-primary flex-1 "
				width={width}
				height={height}
			>
				<title>Loading</title>
				{/* <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
				<path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
			</svg>
		</div>
	);
}
