/**
 * @typedef {import("./FileListSort.mjs").FileListSort} FileListSort
 */
import React from "react";
import FileListTheme from "../theme/FileListTheme.mjs";
import WithStack from "../stack/WithStack.mjs";
import SortMode from "./SortMode.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly sort: FileListSort;
 * }} SortIndicatorProps
 */

/**
 * @param {SortIndicatorProps} props
 */
const SortIndicator = (props) => {
  const stackProps = WithStack.useStack();
  const theme = FileListTheme.useTheme().fileList;
  const text = `${SortIndicator._getIndicator(props.sort)} `;

  return h("text", {
    width: text.length,
    height: 1,
    left: 1,
    top: 1,
    autoFocus: false,
    clickable: true,
    mouse: true,
    style: theme.header,
    onClick: () => {
      process.stdin.emit("keypress", undefined, {
        name: stackProps.isRight ? "r" : "l",
        ctrl: false,
        meta: true,
        shift: false,
      });
    },
    content: text,
  });
};

SortIndicator.displayName = "SortIndicator";

/**
 * @private
 * @param {FileListSort} sort
 * @returns {string}
 */
SortIndicator._getIndicator = (sort) => {
  const indicator = () => {
    switch (sort.mode) {
      case SortMode.Extension:
        return "x";
      case SortMode.ModificationTime:
        return "m";
      case SortMode.Size:
        return "s";
      case SortMode.Unsorted:
        return "u";
      case SortMode.CreationTime:
        return "c";
      case SortMode.AccessTime:
        return "a";
      case SortMode.Name:
      default:
        return "n";
    }
  };

  return sort.asc ? indicator() : indicator().toUpperCase();
};

export default SortIndicator;
