export default FileListView;
export type BlessedScreen = import("@farjs/blessed").Widgets.Screen;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type MouseEvent = import("@farjs/blessed").Widgets.Events.IMouseEventArg;
export type IKeyEventArg = import("@farjs/blessed").Widgets.Events.IKeyEventArg;
export type ThemeStyle = import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
export type FileListItem = import("./api/FileListItem.mjs").FileListItem;
export type FileListViewProps = {
    readonly width: number;
    readonly height: number;
    readonly columns: number;
    readonly items: readonly FileListItem[];
    readonly focusedIndex: number;
    readonly selectedNames: Set<string>;
    onWheel(isUp: boolean): void;
    onClick(index: number): void;
    onKeypress(screen: BlessedScreen, keyFull: string): void;
};
/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly columns: number;
 *  readonly items: readonly FileListItem[];
 *  readonly focusedIndex: number;
 *  readonly selectedNames: Set<string>;
 *  onWheel(isUp: boolean): void;
 *  onClick(index: number): void;
 *  onKeypress(screen: BlessedScreen, keyFull: string): void;
 * }} FileListViewProps
 */
/**
 * @param {FileListViewProps} props
 */
declare function FileListView(props: FileListViewProps): React.ReactElement<{
    ref: React.MutableRefObject<import("blessed").Widgets.BlessedElement>;
    width: number;
    height: number;
    left: number;
    top: number;
}, string | React.JSXElementConstructor<any>>;
declare namespace FileListView {
    export let displayName: string;
    export { VerticalLine as verticalLineComp };
    export { FileListColumn as fileListColumnComp };
}
import React from "react";
import VerticalLine from "@farjs/ui/border/VerticalLine.mjs";
import FileListColumn from "./FileListColumn.mjs";
