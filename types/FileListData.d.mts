export default FileListData;
export type Dispatch = (a: any) => void;
export type ReactComponent = React.FunctionComponent<any> | React.ComponentClass<any>;
export type FileListData = {
    readonly dispatch: Dispatch;
    readonly actions: FileListActions;
    readonly state: FileListState;
};
export type FileListAction = import("./FileListActions.mjs").FileListAction;
export type FileListState = import("./FileListState.mjs").FileListState;
/**
 * @typedef {(a: any) => void} Dispatch
 * @typedef {React.FunctionComponent<any> | React.ComponentClass<any>} ReactComponent
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
declare function FileListData(dispatch: Dispatch, actions: FileListActions, state: FileListState): FileListData;
import FileListActions from "./FileListActions.mjs";
//# sourceMappingURL=FileListData.d.mts.map