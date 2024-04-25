/**
 * @typedef {import("./FileListItem.mjs").FileListItem} FileListItem
 */

/**
 * @typedef {{
 *  readonly path: string;
 *  readonly isRoot: boolean;
 *  readonly items: FileListItem[];
 * }} FileListDir
 */

/**
 * @param {string} path
 * @param {boolean} isRoot
 * @param {FileListItem[]} items
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
