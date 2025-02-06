export default FileListPanel;
export type BlessedScreen = import("@farjs/blessed").Widgets.Screen;
export type SortMode = import("./sort/SortMode.mjs").SortMode;
export type FileListAction = import("./FileListActions.mjs").FileListAction;
export type Dispatch = import("./FileListData.mjs").Dispatch;
export type FileListState = import("./FileListState.mjs").FileListState;
export type FileListPanelProps = {
    readonly dispatch: Dispatch;
    readonly actions: FileListActions;
    readonly state: FileListState;
    onKeypress?(screen: BlessedScreen, keyFull: string): boolean;
};
/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  onKeypress?(screen: BlessedScreen, keyFull: string): boolean;
 * }} FileListPanelProps
 */
/**
 * @param {FileListPanelProps} props
 */
declare function FileListPanel(props: FileListPanelProps): React.FunctionComponentElement<{}>;
declare namespace FileListPanel {
    export const displayName: string;
    export { FileListPanelView as fileListPanelView };
    export { FileListQuickSearch as fileListQuickSearch };
    export { SortModesPopup as sortModesPopup };
}
import FileListActions from "./FileListActions.mjs";
import FileListState from "./FileListState.mjs";
import React from "react";
import FileListPanelView from "./FileListPanelView.mjs";
import FileListQuickSearch from "./FileListQuickSearch.mjs";
import SortModesPopup from "./sort/SortModesPopup.mjs";
