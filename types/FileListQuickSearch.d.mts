export default FileListQuickSearch;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type FileListQuickSearchProps = {
    readonly text: string;
    onClose(): void;
};
/**
 * @typedef {{
 *  readonly text: string;
 *  onClose(): void;
 * }} FileListQuickSearchProps
 */
/**
 * @param {FileListQuickSearchProps} props
 */
declare function FileListQuickSearch(props: FileListQuickSearchProps): React.DOMElement<{
    clickable: boolean;
    mouse: boolean;
    autoFocus: boolean;
    style: import("blessed").Widgets.Types.TStyle;
    onResize: () => void;
    onClick: () => void;
}, Element>;
declare namespace FileListQuickSearch {
    export let displayName: string;
    export { DoubleBorder as doubleBorderComp };
}
import React from "react";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
//# sourceMappingURL=FileListQuickSearch.d.mts.map