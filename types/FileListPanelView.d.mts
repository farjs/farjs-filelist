export default FileListPanelView;
export type BlessedScreen = import("@farjs/blessed").Widgets.Screen;
export type ThemeEffects = import("@farjs/ui/theme/Theme.mjs").ThemeEffects;
export type Dispatch = import("./FileListData.mjs").Dispatch;
export type FileListState = import("./FileListState.mjs").FileListState;
export type FileListPanelViewProps = {
    readonly dispatch: Dispatch;
    readonly actions: FileListActions;
    readonly state: FileListState;
    onKeypress(screen: BlessedScreen, keyFull: string): void;
};
/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListPanelViewProps
 */
/**
 * @param {FileListPanelViewProps} props
 */
declare function FileListPanelView(props: FileListPanelViewProps): React.ReactElement<{
    style: import("@farjs/ui/theme/Theme.mjs").ThemeEffects;
}, string | React.JSXElementConstructor<any>>;
declare namespace FileListPanelView {
    export let displayName: string;
    export { DoubleBorder as doubleBorderComp };
    export { HorizontalLine as horizontalLineComp };
    export { FileList as fileListComp };
    export { TextLine as textLineComp };
    export { SortIndicator as sortIndicator };
}
import FileListActions from "./FileListActions.mjs";
import React from "react";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
import HorizontalLine from "@farjs/ui/border/HorizontalLine.mjs";
import FileList from "./FileList.mjs";
import TextLine from "@farjs/ui/TextLine.mjs";
import SortIndicator from "./sort/SortIndicator.mjs";
