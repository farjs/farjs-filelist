/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("./FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("./FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 */
import React, { useLayoutEffect } from "react";
import WithStack from "./stack/WithStack.mjs";
import FileListItem from "./api/FileListItem.mjs";
import FileListActions from "./FileListActions.mjs";
import FileListView from "./FileListView.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly columns: number;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListProps
 */

/**
 * @param {FileListProps} props
 */
const FileList = (props) => {
  const { fileListViewComp } = FileList;

  const stackProps = WithStack.useStack();
  const items = props.state.currDir.items;
  const itemsLength = items.length;
  const columnSize = props.height - 1; // excluding column header
  const viewSize = columnSize * props.columns;

  const [viewOffset, focusedIndex] = (() => {
    const offset = Math.max(props.state.offset, 0);
    const index = Math.max(props.state.index, 0);

    if (viewSize <= 0 || index < viewSize) {
      return [offset, index];
    }

    const currIndex = offset + index;
    const rawOffset = Math.trunc(currIndex / viewSize) * viewSize;
    const newOffset = Math.max(Math.min(itemsLength - viewSize, rawOffset), 0);
    const focused = Math.max(
      Math.min(itemsLength - newOffset - 1, currIndex - newOffset),
      0
    );
    return [newOffset, focused];
  })();

  const viewItems = items.slice(viewOffset, viewOffset + viewSize);
  const maxOffset = itemsLength - viewItems.length;
  const maxIndex = Math.max(viewItems.length - 1, 0);

  /**
   * @param {number} dx
   * @param {boolean} select
   */
  function focusDx(dx, select) {
    const index = focusedIndex + dx;
    if (index < 0 || index > maxIndex) {
      const newOffset = viewOffset + dx;
      const newIndex =
        newOffset < 0 ? 0 : newOffset > maxOffset ? maxIndex : focusedIndex;

      focusItem(newOffset, newIndex, select);
    } else {
      focusItem(viewOffset, index, select);
    }
  }

  /**
   * @param {number} offset
   * @param {number} index
   * @param {boolean} select
   */
  function focusItem(offset, index, select = false) {
    const newOffset = Math.min(Math.max(offset, 0), maxOffset);
    const newIndex = Math.min(Math.max(index, 0), maxIndex);

    const currSelected = props.state.selectedNames;
    const newSelected = (() => {
      if (select && items.length > 0) {
        const currIndex =
          viewOffset + Math.min(Math.max(focusedIndex, 0), maxIndex);
        const selectIndex = newOffset + newIndex;

        const isFirst = selectIndex === 0;
        const isLast = selectIndex === itemsLength - 1;
        const selection = (() => {
          if (
            isFirst &&
            (selectIndex === currIndex || selectIndex + 1 < currIndex)
          ) {
            return items.slice(selectIndex, currIndex + 1);
          }
          if (selectIndex < currIndex) {
            return items.slice(selectIndex + 1, currIndex + 1);
          }
          if (
            isLast &&
            (selectIndex === currIndex || selectIndex > currIndex + 1)
          ) {
            return items.slice(currIndex, selectIndex + 1);
          }
          return items.slice(currIndex, selectIndex);
        })();

        const currName = items[currIndex].name;
        const newSelected = new Set([...currSelected]);
        if (currSelected.has(currName)) {
          selection.forEach((_) => newSelected.delete(_.name));
        } else {
          selection.forEach((_) => newSelected.add(_.name));
        }

        newSelected.delete(FileListItem.up.name);
        return newSelected;
      }

      return currSelected;
    })();

    if (
      props.state.offset !== newOffset ||
      props.state.index !== newIndex ||
      !isEqualSets(currSelected, newSelected)
    ) {
      /** @type {FileListAction} */
      const action = {
        action: "FileListParamsChangedAction",
        offset: newOffset,
        index: newIndex,
        selectedNames: newSelected,
      };
      props.dispatch(action);
    }
  }

  useLayoutEffect(() => {
    if (props.state.currDir.path.length === 0) {
      props.dispatch(
        props.actions.changeDir(props.dispatch, "", FileListItem.currDir.name)
      );
    }
  }, []);

  return h(fileListViewComp, {
    width: props.width,
    height: props.height,
    columns: props.columns,
    items: viewItems,
    focusedIndex: stackProps.stack.isActive ? focusedIndex : -1,
    selectedNames: props.state.selectedNames,
    onWheel: (up) => {
      if (stackProps.stack.isActive) {
        if (up) {
          if (viewOffset > 0) focusItem(viewOffset - 1, focusedIndex);
          else focusItem(viewOffset, focusedIndex - 1);
        } else {
          if (viewOffset < maxOffset) focusItem(viewOffset + 1, focusedIndex);
          else focusItem(viewOffset, focusedIndex + 1);
        }
      }
    },
    onClick: (index) => {
      focusItem(viewOffset, index);
    },
    onKeypress: (screen, keyFull) => {
      const select = keyFull.startsWith("S-");
      const key = select ? keyFull.substring("S-".length) : keyFull;
      switch (key) {
        case "up":
          focusDx(-1, select);
          break;
        case "down":
          focusDx(1, select);
          break;
        case "left":
          focusDx(-columnSize, select);
          break;
        case "right":
          focusDx(columnSize, select);
          break;
        case "pageup":
          focusDx(-viewSize + 1, select);
          break;
        case "pagedown":
          focusDx(viewSize - 1, select);
          break;
        case "home":
          focusItem(0, 0, select);
          break;
        case "end":
          focusItem(maxOffset, maxIndex, select);
          break;
        default:
          break;
      }

      props.onKeypress(screen, keyFull);
    },
  });
};

FileList.displayName = "FileList";
FileList.fileListViewComp = FileListView;

/**
 * @template {any} T
 * @param {Set<T>} a
 * @param {Set<T>} b
 * @returns {boolean}
 */
function isEqualSets(a, b) {
  if (a === b) return true;
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

export default FileList;
