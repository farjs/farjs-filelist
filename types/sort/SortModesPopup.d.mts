export default SortModesPopup;
export type SortMode = import("./SortMode.mjs").SortMode;
export type FileListSort = import("./FileListSort.mjs").FileListSort;
export type SortModesPopupProps = {
    readonly sort: FileListSort;
    onClose(): void;
};
/**
 * @typedef {{
 *  readonly sort: FileListSort;
 *  onClose(): void;
 * }} SortModesPopupProps
 */
/**
 * @param {SortModesPopupProps} props
 */
declare function SortModesPopup(props: SortModesPopupProps): React.FunctionComponentElement<{
    title: string;
    items: string[];
    getLeft: (width: number) => string;
    onSelect: (index: number) => void;
    onClose: () => void;
}>;
declare namespace SortModesPopup {
    export let displayName: string;
    export { MenuPopup as menuPopup };
}
import React from "react";
import MenuPopup from "@farjs/ui/menu/MenuPopup.mjs";
//# sourceMappingURL=SortModesPopup.d.mts.map