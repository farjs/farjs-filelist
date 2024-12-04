/**
 * @typedef {import("react").ReactElement} ReactElement
 * @typedef {import("../../src/theme/FileListTheme.mjs").FileListTheme} FileListTheme
 */
import React from "react";
import Theme from "@farjs/ui/theme/Theme.mjs";
import FileListTheme from "../../src/theme/FileListTheme.mjs";

const h = React.createElement;

/**
 * @param {ReactElement} element
 * @param {FileListTheme} theme
 * @returns {ReactElement}
 */
const withThemeContext = (element, theme = FileListTheme.defaultTheme) => {
  return h(Theme.Context.Provider, { value: theme }, element);
};

export default withThemeContext;
