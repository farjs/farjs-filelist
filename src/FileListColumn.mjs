/**
 * @typedef {import("@farjs/ui/theme/Theme.mjs").ThemeStyle} ThemeStyle
 * @typedef {import("./api/FileListItem.mjs").FileListItem} FileListItem
 */
import React from "react";
import TextAlign from "@farjs/ui/TextAlign.mjs";
import TextLine from "@farjs/ui/TextLine.mjs";
import UiString from "@farjs/ui/UiString.mjs";
import { renderText, renderText2 } from "@farjs/ui/UI.mjs";
import FileListTheme from "./theme/FileListTheme.mjs";
import FileListItem from "./api/FileListItem.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly left: number;
 *  readonly borderCh: string;
 *  readonly items: readonly FileListItem[];
 *  readonly focusedIndex: number;
 *  readonly selectedNames: Set<string>;
 * }} FileListColumnProps
 */

/**
 * @param {FileListColumnProps} props
 */
const FileListColumn = (props) => {
  const { textLineComp } = FileListColumn;

  const theme = FileListTheme.useTheme().fileList;
  /** @type {ThemeStyle} */
  const headerStyle = theme.header;
  /** @type {ThemeStyle} */
  const style = theme.regularItem;

  const borderEnd = renderText2(theme.regularItem, props.borderCh);
  const overlapEnd = renderText2(theme.regularItem, "}");

  function renderItems() {
    return props.items.map((item, index) => {
      const name = item.name;
      const itemStyle = (() => {
        if (props.selectedNames.has(name)) {
          return theme.selectedItem;
        }
        if (name.startsWith(".") && name !== FileListItem.up.name) {
          return theme.hiddenItem;
        }
        if (item.isDir && name !== FileListItem.up.name) {
          return theme.dirItem;
        }
        const nameLower = name.toLowerCase();
        return nameLower.endsWith(".zip") || nameLower.endsWith(".jar")
          ? theme.archiveItem
          : theme.regularItem;
      })();

      const focused = props.focusedIndex === index;
      const style = focused && itemStyle.focus ? itemStyle.focus : itemStyle;

      const text = UiString(
        name.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", " "),
      );
      const content = renderText(
        style.bold ?? false,
        style.fg,
        style.bg,
        text.ensureWidth(props.width, " "),
      );
      const ending = text.strWidth() > props.width ? overlapEnd : borderEnd;
      return `${content}${ending}`;
    });
  }

  const itemsContent = renderItems().join("\n");

  return h(
    "box",
    {
      width: props.width,
      height: props.height,
      left: props.left,
      style,
    },
    h(textLineComp, {
      align: TextAlign.center,
      left: 0,
      top: 0,
      width: props.width,
      text: "Name",
      style: headerStyle,
      padding: 0,
    }),
    itemsContent.length > 0
      ? h("text", {
          width: props.width + 1,
          top: 1,
          tags: true,
          wrap: false,
          content: itemsContent,
        })
      : null,
  );
};

FileListColumn.displayName = "FileListColumn";
FileListColumn.textLineComp = TextLine;

export default FileListColumn;
