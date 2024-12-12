export default SortIndicator;
export type ThemeStyle = import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
export type FileListSort = import("./FileListSort.mjs").FileListSort;
export type SortIndicatorProps = {
    readonly sort: FileListSort;
};
/**
 * @typedef {{
 *  readonly sort: FileListSort;
 * }} SortIndicatorProps
 */
/**
 * @param {SortIndicatorProps} props
 */
declare function SortIndicator(props: SortIndicatorProps): React.DOMElement<{
    width: number;
    height: number;
    left: number;
    top: number;
    autoFocus: boolean;
    clickable: boolean;
    mouse: boolean;
    style: import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
    onClick: () => void;
    content: string;
}, Element>;
declare namespace SortIndicator {
    const displayName: string;
    /**
     * @private
     * @param {FileListSort} sort
     * @returns {string}
     */
    function _getIndicator(sort: import("./FileListSort.mjs").FileListSort): string;
}
import React from "react";
