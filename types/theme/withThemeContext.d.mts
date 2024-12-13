export default withThemeContext;
export type ReactElement = import("react").ReactElement;
export type FileListTheme = import("./FileListTheme.mjs").FileListTheme;
/**
 * Common test util.
 *
 * @param {ReactElement} element
 * @param {FileListTheme} theme
 * @returns {ReactElement}
 */
declare function withThemeContext(element: ReactElement, theme?: FileListTheme): ReactElement;
import FileListTheme from "./FileListTheme.mjs";
