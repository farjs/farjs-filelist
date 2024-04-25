export default FileListStateReducer;
export type FileListDir = import("./api/FileListDir.mjs").FileListDir;
export type FileListItem = import("./api/FileListItem.mjs").FileListItem;
export type FileListSort = import("./sort/FileListSort.mjs").FileListSort;
export type FileListAction = import("./FileListAction.mjs").FileListAction;
export type FileListState = import("./FileListState.mjs").FileListState;
/**
 * @param {FileListState} state
 * @param {any} action
 * @returns {FileListState}
 */
declare function FileListStateReducer(state: FileListState, action: any): FileListState;
import FileListState from "./FileListState.mjs";
