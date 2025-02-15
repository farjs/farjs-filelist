export default FileListActions;
export type FileListDir = import("./api/FileListDir.mjs").FileListDir;
export type FileListItem = import("./api/FileListItem.mjs").FileListItem;
export type FileTarget = import("./api/FileListApi.mjs").FileTarget;
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
declare class FileListActions {
    /**
     * @param {FileListApi} api
     */
    constructor(api: FileListApi);
    /** @readonly @type {FileListApi} */
    readonly api: FileListApi;
    /**
     * @param {(a: FileListAction) => any} dispatch
     * @param {string} path
     * @param {string} dir
     * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
     */
    changeDir(dispatch: (a: FileListAction) => any, path: string, dir: string): import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>;
    /**
     * @param {(a: FileListAction) => any} dispatch
     * @param {string} path
     * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
     */
    updateDir(dispatch: (a: FileListAction) => any, path: string): import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>;
    /**
     * @param {(a: FileListAction) => any} dispatch
     * @param {string} parent
     * @param {string} dir
     * @param {boolean} multiple
     * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
     */
    createDir(dispatch: (a: FileListAction) => any, parent: string, dir: string, multiple: boolean): import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>;
    /**
     * @param {(a: any) => any} dispatch
     * @param {string} parent
     * @param {readonly FileListItem[]} items
     * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<void>}
     */
    deleteItems(dispatch: (a: any) => any, parent: string, items: readonly FileListItem[]): import("@farjs/ui/task/TaskAction.mjs").TaskAction<void>;
    /**
     * @param {string} parent
     * @param {readonly FileListItem[]} items
     * @param {(path: string, items: readonly FileListItem[]) => boolean} onNextDir
     * @returns {Promise<boolean>}
     */
    scanDirs(parent: string, items: readonly FileListItem[], onNextDir: (path: string, items: readonly FileListItem[]) => boolean): Promise<boolean>;
    /**
     * @param {string} srcDir
     * @param {FileListItem} srcItem
     * @param {Promise<FileTarget | undefined>} dstFileP
     * @param {(pos: number) => Promise<boolean>} onProgress
     * @returns {Promise<boolean>}
     */
    copyFile(srcDir: string, srcItem: FileListItem, dstFileP: Promise<FileTarget | undefined>, onProgress: (pos: number) => Promise<boolean>): Promise<boolean>;
}
import FileListApi from "./api/FileListApi.mjs";
