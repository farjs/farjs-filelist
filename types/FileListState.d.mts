export default FileListState;
export type FileListState = {
    readonly offset: number;
    readonly index: number;
    readonly currDir: FileListDir;
    readonly selectedNames: Set<string>;
    readonly diskSpace?: number;
    readonly sort: FileListSort;
};
export type FileListDir = import("./api/FileListDir.mjs").FileListDir;
export type FileListItem = import("./api/FileListItem.mjs").FileListItem;
export type FileListSort = import("./sort/FileListSort.mjs").FileListSort;
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
declare function FileListState(): FileListState;
declare namespace FileListState {
    function currentItem(s: FileListState, p?: ((item: import("./api/FileListItem.mjs").FileListItem) => boolean) | undefined): import("./api/FileListItem.mjs").FileListItem | undefined;
    function selectedItems(s: FileListState): import("./api/FileListItem.mjs").FileListItem[];
    function isFileListState(s: any): boolean;
}
