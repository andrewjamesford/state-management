/**
 * Function to parse the current page and step from a given path.
 *
 * @param {string} path - The current URL path, which should be in the format "/page/step".
 * @returns {{page: string, step: number}} An object containing the parsed "page" and "step" values.
 */
export function getPageAndPath(path) {
	const stepArray = path[0]?.split("/");
	const page = stepArray[1] || "state";
	const step = Number.parseInt(stepArray[2]) || 1;
	return { page, step };
}
