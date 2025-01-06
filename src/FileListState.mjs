/**
 * @typedef {import("./api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("./sort/FileListSort.mjs").FileListSort} FileListSort
 */
import { isSet } from "node:util/types";
import SortMode from "./sort/SortMode.mjs";

/**
 * @typedef {{
 *  readonly offset: number;
 *  readonly index: number;
 *  readonly currDir: FileListDir;
 *  readonly selectedNames: Set<string>;
 *  readonly diskSpace?: number;
 *  readonly sort: FileListSort;
 * }} FileListState
 */

/**
 * @returns {FileListState}
 */
function FileListState() {
  return {
    offset: 0,
    index: 0,
    currDir: { path: "", isRoot: false, items: [] },
    selectedNames: new Set(),
    sort: { mode: SortMode.Name, asc: true },
  };
}

/** @type {(s: FileListState) => FileListItem | undefined} */
FileListState.currentItem = (s) => {
  const itemIndex = s.offset + s.index;
  if (itemIndex >= 0 && itemIndex < s.currDir.items.length) {
    return s.currDir.items[itemIndex];
  }
  return undefined;
};

/** @type {(s: FileListState) => FileListItem[]} */
FileListState.selectedItems = (s) => {
  if (s.selectedNames.size > 0) {
    return s.currDir.items.filter((i) => {
      return s.selectedNames.has(i.name);
    });
  }
  return [];
};

/** @type {(s: any) => boolean} */
FileListState.isFileListState = (s) => {
  return (
    !!s &&
    typeof s.offset === "number" &&
    typeof s.index === "number" &&
    isFileListDir(s.currDir) &&
    isSet(s.selectedNames) &&
    isFileListSort(s.sort)
  );
};

/**
 * @param {any} d
 * @returns {boolean}
 */
function isFileListDir(d) {
  return (
    !!d &&
    typeof d.path === "string" &&
    typeof d.isRoot === "boolean" &&
    Array.isArray(d.items)
  );
}

/**
 * @param {any} s
 * @returns {boolean}
 */
function isFileListSort(s) {
  return !!s && typeof s.mode === "string" && typeof s.asc === "boolean";
}

export default FileListState;
