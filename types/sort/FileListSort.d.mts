export default FileListSort;
export type FileListSort = {
    readonly mode: SortMode;
    readonly asc: boolean;
};
export type SortableItem = {
    idx: number;
    name: string;
    nameNormalized: string;
    ext: string;
    extNormalized: string;
    size: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
};
export type FileListItem = import("../api/FileListItem.mjs").FileListItem;
export type SortMode = import("./SortMode.mjs").SortMode;
/**
 * @param {SortMode} mode
 * @param {boolean} asc
 * @returns {FileListSort}
 */
declare function FileListSort(mode: SortMode, asc: boolean): FileListSort;
declare namespace FileListSort {
    export { nextSort };
    export { sortItems };
}
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
declare function nextSort(sort: FileListSort, nextMode: SortMode): FileListSort;
/**
 * @param {FileListItem[]} items
 * @param {SortMode} mode
 * @returns {FileListItem[]}
 */
declare function sortItems(items: FileListItem[], mode: SortMode): FileListItem[];
