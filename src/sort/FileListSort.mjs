/**
 * @typedef {import("../api/FileListItem").FileListItem} FileListItem
 * @typedef {import("./SortMode.mjs").SortMode} SortMode
 * @typedef {import("./FileListSort").FileListSort} FileListSort
 */
import SortMode from "./SortMode.mjs";

/**
 * @param {FileListSort} sort
 * @param {SortMode} nextMode
 * @returns {FileListSort}
 */
function nextSort(sort, nextMode) {
  /** @returns {boolean} */
  function nextAsc() {
    if (sort.mode === nextMode) {
      return !sort.asc;
    }

    switch (nextMode) {
      case SortMode.Name:
      case SortMode.Extension:
      case SortMode.Unsorted:
        return true;
      case SortMode.ModificationTime:
      case SortMode.Size:
      case SortMode.CreationTime:
      case SortMode.AccessTime:
        return false;
    }
  }

  return {
    mode: nextMode,
    asc: nextAsc(),
  };
}

/**
 * @param {string} s1
 * @param {string} s2
 * @returns {number}
 */
function strCompare(s1, s2) {
  return s1 === s2 ? 0 : s1 < s2 ? -1 : 1;
}

/**
 * @param {FileListItem} i1
 * @param {FileListItem} i2
 * @returns {number}
 */
function sortByName(i1, i2) {
  const res = strCompare(i1.nameNormalized(), i2.nameNormalized());
  return res === 0 ? strCompare(i1.name, i2.name) : res;
}

/**
 * @param {FileListItem} i1
 * @param {FileListItem} i2
 * @returns {number}
 */
function sortByExt(i1, i2) {
  const res = strCompare(i1.extNormalized(), i2.extNormalized());
  return res === 0 ? strCompare(i1.ext(), i2.ext()) : res;
}

/**
 * @param {FileListItem[]} items
 * @param {SortMode} mode
 * @returns {FileListItem[]}
 */
function sortItems(items, mode) {
  const newItems = [...items];
  switch (mode) {
    case SortMode.Name:
      return newItems.sort(sortByName);
    case SortMode.Extension:
      return newItems.sort((i1, i2) => {
        const res = sortByExt(i1, i2);
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.ModificationTime:
      return newItems.sort((i1, i2) => {
        const res = i1.mtimeMs - i2.mtimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.Size:
      return newItems.sort((i1, i2) => {
        const res = i1.size - i2.size;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.Unsorted:
      return items;
    case SortMode.CreationTime:
      return newItems.sort((i1, i2) => {
        const res = i1.ctimeMs - i2.ctimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.AccessTime:
      return newItems.sort((i1, i2) => {
        const res = i1.atimeMs - i2.atimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
  }
}

const FileListSort = {
  nextSort,
  sortItems,
};

export default FileListSort;
