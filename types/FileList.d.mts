export default FileList;
export type BlessedScreen = import("@farjs/blessed").Widgets.Screen;
export type FileListAction = import("./FileListActions.mjs").FileListAction;
export type Dispatch = import("./FileListData.mjs").Dispatch;
export type FileListState = import("./FileListState.mjs").FileListState;
export type FileListProps = {
    readonly dispatch: Dispatch;
    readonly actions: FileListActions;
    readonly state: FileListState;
    readonly width: number;
    readonly height: number;
    readonly columns: number;
    onKeypress(screen: BlessedScreen, keyFull: string): void;
};
/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  readonly width: number;
 *  readonly height: number;
 *  readonly columns: number;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListProps
 */
/**
 * @param {FileListProps} props
 */
declare function FileList(props: FileListProps): React.FunctionComponentElement<{
    width: number;
    height: number;
    columns: number;
    items: import("./api/FileListItem.mjs").FileListItem[];
    focusedIndex: number;
    selectedNames: Set<string>;
    onWheel: (up: boolean) => void;
    onClick: (index: number) => void;
    onKeypress: (screen: import("blessed").Widgets.Screen, keyFull: string) => void;
}>;
declare namespace FileList {
    export let displayName: string;
    export { FileListView as fileListViewComp };
}
import FileListActions from "./FileListActions.mjs";
import React from "react";
import FileListView from "./FileListView.mjs";
//# sourceMappingURL=FileList.d.mts.map