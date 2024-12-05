/**
 * @typedef {import("./FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 */
import FileListActions from "./FileListActions.mjs";

/**
 * @typedef {(a: any) => void} Dispatch
 */

/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 * }} FileListData
 */

/**
 * @param {Dispatch} dispatch
 * @param {FileListActions} actions
 * @param {FileListState} state
 * @returns {FileListData}
 */
function FileListData(dispatch, actions, state) {
  return { dispatch, actions, state };
}

export default FileListData;
