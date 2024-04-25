/**
 * @typedef {import("./api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("./sort/FileListSort.mjs").FileListSort} FileListSort
 * @typedef {import("./FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 */
import FileListItem from "./api/FileListItem.mjs";
import FileListSort from "./sort/FileListSort.mjs";
import FileListState from "./FileListState.mjs";

/**
 * @param {FileListState} state
 * @param {any} action
 * @returns {FileListState}
 */
function FileListStateReducer(state, action) {
  /** @type {FileListAction} */
  const a = action;
  switch (a.action) {
    case "FileListParamsChangedAction":
      return {
        ...state,
        offset: a.offset,
        index: a.index,
        selectedNames: a.selectedNames,
      };

    case "FileListDirChangedAction": {
      const processed = processDir(a.currDir, state.sort);
      const newIndex = () => {
        if (a.dir === FileListItem.up.name) {
          let focusedDir = stripPrefix(state.currDir.path, a.currDir.path);
          focusedDir = stripPrefix(focusedDir, "/");
          focusedDir = stripPrefix(focusedDir, "\\");

          return Math.max(
            processed.items.findIndex((i) => i.name === focusedDir),
            0
          );
        }
        return 0;
      };

      return {
        ...state,
        offset: 0,
        index: newIndex(),
        currDir: processed,
        selectedNames: new Set(),
      };
    }
    case "FileListDirUpdatedAction": {
      const processed = processDir(a.currDir, state.sort);
      const currIndex = state.offset + state.index;
      const newIndex = (() => {
        const currItem = FileListState.currentItem(state);
        if (currItem) {
          const index = processed.items.findIndex(
            (i) => i.name === currItem.name
          );
          return index < 0
            ? Math.min(currIndex, a.currDir.items.length)
            : index;
        }
        return 0;
      })();
      const [offset, index] =
        newIndex === currIndex ? [state.offset, state.index] : [0, newIndex];

      const newSelected = () => {
        const names = new Set();
        processed.items.forEach((i) => {
          if (state.selectedNames.has(i.name)) {
            names.add(i.name);
          }
        });
        return names;
      };

      return {
        ...state,
        offset,
        index,
        currDir: processed,
        selectedNames:
          state.selectedNames.size > 0 ? newSelected() : state.selectedNames,
      };
    }
    case "FileListItemCreatedAction": {
      const processed = processDir(a.currDir, state.sort);
      const newIndex = processed.items.findIndex((i) => i.name === a.name);
      const [offset, index] =
        newIndex < 0 ? [state.offset, state.index] : [0, newIndex];

      return {
        ...state,
        offset,
        index,
        currDir: processed,
      };
    }
    case "FileListSortAction": {
      const nextSort = FileListSort.nextSort(state.sort, a.mode);
      const processed = processDir(state.currDir, nextSort);
      const currItem = FileListState.currentItem(state);
      const newIndex = currItem
        ? processed.items.findIndex((i) => i.name === currItem.name)
        : -1;
      const [offset, index] =
        newIndex < 0 ? [state.offset, state.index] : [0, newIndex];

      return {
        ...state,
        offset,
        index,
        currDir: processed,
        sort: nextSort,
      };
    }
    case "FileListDiskSpaceUpdatedAction":
      return {
        ...state,
        diskSpace: a.diskSpace,
      };

    default:
      return state;
  }
}

/**
 * @param {string} s
 * @param {string} prefix
 * @returns {string}
 */
function stripPrefix(s, prefix) {
  return s.startsWith(prefix) ? s.substring(prefix.length) : s;
}

/**
 * @param {FileListDir} currDir
 * @param {FileListSort} sort
 * @returns {FileListDir}
 */
function processDir(currDir, sort) {
  /**
   * @returns {FileListItem[]}
   */
  function sortCurrItems() {
    const dirs = currDir.items.filter(
      (i) => i.name !== FileListItem.up.name && i.isDir
    );
    const files = currDir.items.filter(
      (i) => i.name !== FileListItem.up.name && !i.isDir
    );
    const sortedDirs = sortItems(dirs, sort);
    const sortedFiles = sortItems(files, sort);

    return currDir.isRoot
      ? [...sortedDirs, ...sortedFiles]
      : [FileListItem.up, ...sortedDirs, ...sortedFiles];
  }

  return { ...currDir, items: sortCurrItems() };
}

/**
 * @param {FileListItem[]} items
 * @param {FileListSort} sort
 * @returns {FileListItem[]}
 */
function sortItems(items, sort) {
  const sorted = FileListSort.sortItems(items, sort.mode);
  return sort.asc ? sorted : sorted.reverse();
}

export default FileListStateReducer;
