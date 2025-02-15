/**
 * @typedef {import("./FileListItem.mjs").FileListItem} FileListItem
 */

/**
 * @typedef {{
 *  readonly path: string;
 *  readonly isRoot: boolean;
 *  readonly items: readonly FileListItem[];
 * }} FileListDir
 */

/**
 * @param {string} path
 * @param {boolean} isRoot
 * @param {readonly FileListItem[]} items
 * @returns {FileListDir}
 */
function FileListDir(path, isRoot, items) {
  return {
    path,
    isRoot,
    items,
  };
}

export default FileListDir;
