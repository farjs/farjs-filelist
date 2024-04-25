export default FileListActions;
export type FileListDir = import("./api/FileListDir.mjs").FileListDir;
export type SortMode = import("./sort/SortMode.mjs").SortMode;
export type FileListAction = FileListParamsChangedAction | FileListDirChangedAction | FileListDirUpdatedAction | FileListItemCreatedAction | FileListDiskSpaceUpdatedAction | FileListSortAction;
export type FileListParamsChangedAction = {
    readonly action: "FileListParamsChangedAction";
    readonly offset: number;
    readonly index: number;
    readonly selectedNames: Set<string>;
};
export type FileListDirChangedAction = {
    readonly action: "FileListDirChangedAction";
    readonly dir: string;
    readonly currDir: FileListDir;
};
export type FileListDirUpdatedAction = {
    readonly action: "FileListDirUpdatedAction";
    readonly currDir: FileListDir;
};
export type FileListItemCreatedAction = {
    readonly action: "FileListItemCreatedAction";
    readonly name: string;
    readonly currDir: FileListDir;
};
export type FileListDiskSpaceUpdatedAction = {
    readonly action: "FileListDiskSpaceUpdatedAction";
    readonly diskSpace: number;
};
export type FileListSortAction = {
    readonly action: "FileListSortAction";
    readonly mode: SortMode;
};
/**
 * @typedef {import("./api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./sort/SortMode.mjs").SortMode} SortMode
 */
declare class FileListActions {
}
