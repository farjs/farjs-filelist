/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("@farjs/ui/theme/Theme.mjs").ThemeEffects} ThemeEffects
 * @typedef {import("./FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 */
import React from "react";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
import HorizontalLine from "@farjs/ui/border/HorizontalLine.mjs";
import SingleChars from "@farjs/ui/border/SingleChars.mjs";
import DoubleChars from "@farjs/ui/border/DoubleChars.mjs";
import TextLine from "@farjs/ui/TextLine.mjs";
import TextAlign from "@farjs/ui/TextAlign.mjs";
import FileListTheme from "./theme/FileListTheme.mjs";
import WithStack from "./stack/WithStack.mjs";
import SortIndicator from "./sort/SortIndicator.mjs";
import FileListItem from "./api/FileListItem.mjs";
import FileListActions from "./FileListActions.mjs";
import FileListState from "./FileListState.mjs";
import FileList from "./FileList.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListPanelViewProps
 */

/**
 * @param {FileListPanelViewProps} props
 */
const FileListPanelView = (props) => {
  const {
    doubleBorderComp,
    horizontalLineComp,
    fileListComp,
    textLineComp,
    sortIndicator,
  } = FileListPanelView;

  const panelStack = WithStack.useStack();
  const width = panelStack.width;
  const height = panelStack.height;
  const theme = FileListTheme.useTheme().fileList;
  /** @type {ThemeEffects} */
  const style = theme.regularItem;

  const currItem = FileListState.currentItem(props.state);
  const selectedItems = FileListState.selectedItems(props.state);

  return h(
    "box",
    { style },
    h(doubleBorderComp, { width, height, style }),
    h(horizontalLineComp, {
      left: 0,
      top: height - 4,
      length: width,
      lineCh: SingleChars.horizontal,
      style,
      startCh: DoubleChars.leftSingle,
      endCh: DoubleChars.rightSingle,
    }),
    h(fileListComp, {
      dispatch: props.dispatch,
      actions: props.actions,
      state: props.state,
      width: width - 2,
      height: height - 5,
      columns: 2,
      onKeypress: props.onKeypress,
    }),
    h(textLineComp, {
      align: TextAlign.center,
      left: 1,
      top: 0,
      width: width - 2,
      text: props.state.currDir.path,
      style,
      focused: panelStack.stack.isActive,
    }),
    h(sortIndicator, { sort: props.state.sort }),

    selectedItems.length > 0
      ? h(textLineComp, {
          align: TextAlign.center,
          left: 1,
          top: height - 4,
          width: width - 2,
          text: (() => {
            const selectedSize = selectedItems.reduce(
              (res, item) => res + item.size,
              0
            );
            const selectedSizeFmt = sizeFormatter.format(selectedSize);
            const count = selectedItems.length;
            const files = count === 1 ? "file" : "files";
            return `${selectedSizeFmt} in ${count} ${files}`;
          })(),
          style: theme.selectedItem,
        })
      : null,

    h(textLineComp, {
      align: TextAlign.left,
      left: 1,
      top: height - 3,
      width: width - 2 - 12,
      text: currItem ? currItem.name : "",
      style,
      padding: 0,
    }),
    h(textLineComp, {
      align: TextAlign.right,
      left: 1 + width - 2 - 12,
      top: height - 3,
      width: 12,
      text: (() => {
        if (!currItem || (currItem.isDir && currItem.size === 0.0)) {
          return "";
        }
        if (currItem.size >= 1000000000) {
          const sizeFmt = sizeFormatter.format(currItem.size / 1000000000);
          return `~${sizeFmt} G`;
        }
        return sizeFormatter.format(currItem.size);
      })(),
      style,
      padding: 0,
    }),

    h(textLineComp, {
      align: TextAlign.left,
      left: 1,
      top: height - 2,
      width: 10,
      text: currItem ? currItem.permissions : "",
      style,
      padding: 0,
    }),
    h(textLineComp, {
      align: TextAlign.right,
      left: 1 + width - 2 - 25,
      top: height - 2,
      width: 25,
      text: (() => {
        if (!currItem || currItem.name === FileListItem.up.name) {
          return "";
        }
        const date = new Date(currItem.mtimeMs);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      })(),
      style,
      padding: 0,
    }),

    h(textLineComp, {
      align: TextAlign.center,
      left: 1,
      top: height - 1,
      width:
        props.state.diskSpace === undefined
          ? width - 2
          : Math.trunc((width - 2) / 2),
      text: (() => {
        const files = props.state.currDir.items.filter((_) => !_.isDir);
        const filesSize = files.reduce((res, f) => res + f.size, 0);
        const filesSizeFmt = sizeFormatter.format(filesSize);
        return `${filesSizeFmt} (${files.length})`;
      })(),
      style,
    }),
    props.state.diskSpace
      ? h(textLineComp, {
          align: TextAlign.center,
          left: Math.trunc((width - 2) / 2) + 1,
          top: height - 1,
          width: Math.trunc((width - 2) / 2),
          text: sizeFormatter.format(props.state.diskSpace),
          style,
        })
      : null
  );
};

const sizeFormatter = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 0,
});

FileListPanelView.displayName = "FileListPanelView";
FileListPanelView.doubleBorderComp = DoubleBorder;
FileListPanelView.horizontalLineComp = HorizontalLine;
FileListPanelView.fileListComp = FileList;
FileListPanelView.textLineComp = TextLine;
FileListPanelView.sortIndicator = SortIndicator;

export default FileListPanelView;
