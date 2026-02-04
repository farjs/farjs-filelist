/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IMouseEventArg} MouseEvent
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("@farjs/ui/theme/Theme.mjs").ThemeStyle} ThemeStyle
 * @typedef {import("./api/FileListItem.mjs").FileListItem} FileListItem
 */
import React, { useLayoutEffect, useMemo, useRef } from "react";
import DoubleChars from "@farjs/ui/border/DoubleChars.mjs";
import SingleChars from "@farjs/ui/border/SingleChars.mjs";
import VerticalLine from "@farjs/ui/border/VerticalLine.mjs";
import FileListTheme from "./theme/FileListTheme.mjs";
import WithStack from "./stack/WithStack.mjs";
import FileListItem from "./api/FileListItem.mjs";
import FileListColumn from "./FileListColumn.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly columns: number;
 *  readonly items: readonly FileListItem[];
 *  readonly focusedIndex: number;
 *  readonly selectedNames: Set<string>;
 *  onWheel(isUp: boolean): void;
 *  onClick(index: number): void;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListViewProps
 */

/**
 * @param {FileListViewProps} props
 */
const FileListView = (props) => {
  const { verticalLineComp, fileListColumnComp } = FileListView;

  const elementRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const propsRef = /** @type {React.MutableRefObject<FileListViewProps>} */ (
    useRef()
  );
  const columnSizeRef = /** @type {React.MutableRefObject<number>} */ (
    useRef()
  );
  /**
   * @typedef {{
   *  readonly colLeft: number;
   *  readonly colWidth: number;
   * }} ColumnInfo
   */
  const columnsPosRef =
    /** @type {React.MutableRefObject<readonly ColumnInfo[]>} */ (useRef());
  const inputEl = WithStack.useStack().panelInput;
  const currTheme = FileListTheme.useTheme();
  const { width, height, columns } = props;

  propsRef.current = props;
  columnSizeRef.current = height - 1; // excluding column header

  columnsPosRef.current = useMemo(() => {
    return Array.from({ length: columns }, (_, colIndex) => {
      const colWidth = Math.trunc(width / columns);
      const colLeft = colIndex * colWidth;
      const finalWidth =
        colIndex === columns - 1 ? width - colLeft : colWidth - 1;

      return { colLeft, colWidth: finalWidth };
    });
  }, [width, columns]);

  useLayoutEffect(() => {
    /** @type {(ch: object, key: IKeyEventArg) => void} */
    const keyListener = (_, key) => {
      propsRef.current.onKeypress(inputEl.screen, key.full);
    };
    /** @type {(data: {shift: boolean}) => void} */
    const wheelupListener = (data) => {
      if (!data.shift) {
        propsRef.current.onWheel(true);
      }
    };
    /** @type {(data: {shift: boolean}) => void} */
    const wheeldownListener = (data) => {
      if (!data.shift) {
        propsRef.current.onWheel(false);
      }
    };
    /** @type {(data: MouseEvent) => void} */
    const clickListener = (data) => {
      const curr = elementRef.current;
      const x = data.x - /** @type {number} */ (curr.aleft);
      const y = data.y - /** @type {number} */ (curr.atop);
      const colIndex = columnsPosRef.current.findIndex(
        ({ colLeft, colWidth }) => colLeft <= x && x < colLeft + colWidth,
      );
      if (colIndex !== -1) {
        const itemPos = y > 0 ? y - 1 : y; // exclude column header
        propsRef.current.onClick(colIndex * columnSizeRef.current + itemPos);
      }
    };

    inputEl.on("keypress", keyListener);
    inputEl.on("wheelup", wheelupListener);
    inputEl.on("wheeldown", wheeldownListener);
    inputEl.on("click", clickListener);

    return () => {
      inputEl.off("keypress", keyListener);
      inputEl.off("wheelup", wheelupListener);
      inputEl.off("wheeldown", wheeldownListener);
      inputEl.off("click", clickListener);
    };
  }, [inputEl]);

  const colSize = columnSizeRef.current;

  /** @type {readonly React.ReactNode[]} */
  const renderedColumns =
    colSize > 0
      ? columnsPosRef.current.flatMap(({ colLeft, colWidth }, colIndex) => {
          const startIdx = colIndex * colSize;
          const colItems = props.items.slice(startIdx, startIdx + colSize);
          const lastIdx = startIdx + colItems.length - 1;
          const propsFocusedIdx = props.focusedIndex;
          const focusedIndex =
            startIdx <= propsFocusedIdx && propsFocusedIdx <= lastIdx
              ? propsFocusedIdx - startIdx
              : -1;
          const isLastCol = colIndex === columns - 1;

          return [
            !isLastCol
              ? h(verticalLineComp, {
                  left: colLeft + colWidth,
                  top: -1,
                  length: height + 2,
                  lineCh: SingleChars.vertical,
                  style: currTheme.fileList.regularItem,
                  startCh: DoubleChars.topSingle,
                  endCh: SingleChars.bottom,
                })
              : null,

            h(fileListColumnComp, {
              width: colWidth,
              height: height,
              left: colLeft,
              borderCh: !isLastCol
                ? SingleChars.vertical
                : DoubleChars.vertical,
              items: colItems,
              focusedIndex,
              selectedNames: props.selectedNames,
            }),
          ];
        })
      : [];

  return h(
    "box",
    {
      ref: elementRef,
      width: width,
      height: height,
      left: 1,
      top: 1,
    },
    ...renderedColumns,
  );
};

FileListView.displayName = "FileListView";
FileListView.verticalLineComp = VerticalLine;
FileListView.fileListColumnComp = FileListColumn;

export default FileListView;
