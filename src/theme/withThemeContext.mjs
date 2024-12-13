/**
 * @typedef {import("react").ReactElement} ReactElement
 * @typedef {import("./FileListTheme.mjs").FileListTheme} FileListTheme
 */
import React from "react";
import Theme from "@farjs/ui/theme/Theme.mjs";
import FileListTheme from "./FileListTheme.mjs";

const h = React.createElement;

/**
 * Common test util.
 *
 * @param {ReactElement} element
 * @param {FileListTheme} theme
 * @returns {ReactElement}
 */
const withThemeContext = (element, theme = FileListTheme.defaultTheme) => {
  return h(Theme.Context.Provider, { value: theme }, element);
};

export default withThemeContext;
