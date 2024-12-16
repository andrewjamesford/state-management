interface PageAndPath {
  page: string;
  step: number;
}

/**
 * Function to parse the current page and step from a given path.
 *
 * @param {string} path - The current URL path, which should be in the format "/page/step".
 * @returns {PageAndPath} An object containing the parsed "page" and "step" values.
 */
export function getPageAndPath(path: string): PageAndPath {
  const stepArray: string[] = path.split("/") || [];
  const page: string = stepArray[1] ?? "state";
  const step: number = Number.parseInt(stepArray[2] ?? "1") || 1;
  return { page, step };
}
