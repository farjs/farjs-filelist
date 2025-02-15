export default FileListDir;
export type FileListItem = import("./FileListItem.mjs").FileListItem;
export type FileListDir = {
    readonly path: string;
    readonly isRoot: boolean;
    readonly items: readonly FileListItem[];
};
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
declare function FileListDir(path: string, isRoot: boolean, items: readonly FileListItem[]): FileListDir;
