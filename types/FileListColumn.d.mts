export default FileListColumn;
export type ThemeStyle = import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
export type FileListItem = import("./api/FileListItem.mjs").FileListItem;
export type FileListColumnProps = {
    readonly width: number;
    readonly height: number;
    readonly left: number;
    readonly borderCh: string;
    readonly items: readonly FileListItem[];
    readonly focusedIndex: number;
    readonly selectedNames: Set<string>;
};
/**
 * @typedef {{
 *  readonly width: number;
 *  readonly height: number;
 *  readonly left: number;
 *  readonly borderCh: string;
 *  readonly items: readonly FileListItem[];
 *  readonly focusedIndex: number;
 *  readonly selectedNames: Set<string>;
 * }} FileListColumnProps
 */
/**
 * @param {FileListColumnProps} props
 */
declare function FileListColumn(props: FileListColumnProps): React.ReactElement<{
    width: number;
    height: number;
    left: number;
    style: import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
}, string | React.JSXElementConstructor<any>>;
declare namespace FileListColumn {
    export let displayName: string;
    export { TextLine as textLineComp };
}
import React from "react";
import TextLine from "@farjs/ui/TextLine.mjs";
//# sourceMappingURL=FileListColumn.d.mts.map