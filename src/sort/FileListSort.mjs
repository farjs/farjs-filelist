/**
 * @typedef {import("../api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("./SortMode.mjs").SortMode} SortMode
 */
import SortMode from "./SortMode.mjs";

/**
 * @typedef {{
 *  readonly mode: SortMode;
 *  readonly asc: boolean;
 * }} FileListSort
 */

/**
 * @param {FileListSort} sort
 * @param {SortMode} nextMode
 * @returns {FileListSort}
 */
function nextSort(sort, nextMode) {
  /**
   * @returns {boolean}
   */
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
 * @typedef {{
 *    idx: number,
 *    name: string,
 *    nameNormalized: string,
 *    ext: string,
 *    extNormalized: string,
 *    size: number,
 *    atimeMs: number,
 *    mtimeMs: number,
 *    ctimeMs: number,
 * }} SortableItem
 */

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function strCompare(a, b) {
  return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * @param {SortableItem} a
 * @param {SortableItem} b
 * @returns {number}
 */
function sortByName(a, b) {
  const res = strCompare(a.nameNormalized, b.nameNormalized);
  return res === 0 ? strCompare(a.name, b.name) : res;
}

/**
 * @param {SortableItem} a
 * @param {SortableItem} b
 * @returns {number}
 */
function sortByExt(a, b) {
  const res = strCompare(a.extNormalized, b.extNormalized);
  return res === 0 ? strCompare(a.ext, b.ext) : res;
}

/**
 * @param {FileListItem[]} items
 * @param {SortMode} mode
 * @returns {FileListItem[]}
 */
function sortItems(items, mode) {
  /**
   * @param {(a: SortableItem, b: SortableItem) => number} compareFn
   * @returns {FileListItem[]}
   */
  function doSort(compareFn) {
    const sortableItems = items.map((item, idx) => {
      const extIndex = item.name.lastIndexOf(".");
      const ext = item.name.substring(extIndex + 1);

      return {
        idx,
        name: item.name,
        nameNormalized: item.name.toLowerCase(),
        ext,
        extNormalized: ext.toLowerCase(),
        size: item.size,
        atimeMs: item.atimeMs,
        mtimeMs: item.mtimeMs,
        ctimeMs: item.ctimeMs,
      };
    });

    return sortableItems.sort(compareFn).map((item) => items[item.idx]);
  }

  switch (mode) {
    case SortMode.Name:
      return doSort(sortByName);
    case SortMode.Extension:
      return doSort((i1, i2) => {
        const res = sortByExt(i1, i2);
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.ModificationTime:
      return doSort((i1, i2) => {
        const res = i1.mtimeMs - i2.mtimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.Size:
      return doSort((i1, i2) => {
        const res = i1.size - i2.size;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.Unsorted:
      return items;
    case SortMode.CreationTime:
      return doSort((i1, i2) => {
        const res = i1.ctimeMs - i2.ctimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
    case SortMode.AccessTime:
      return doSort((i1, i2) => {
        const res = i1.atimeMs - i2.atimeMs;
        return res === 0 ? sortByName(i1, i2) : res;
      });
  }
}

/**
 * @param {SortMode} mode
 * @param {boolean} asc
 * @returns {FileListSort}
 */
function FileListSort(mode, asc) {
  return { mode, asc };
}

FileListSort.nextSort = nextSort;
FileListSort.sortItems = sortItems;

export default FileListSort;
