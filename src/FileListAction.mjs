/**
 * @typedef {import("./api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./sort/SortMode.mjs").SortMode} SortMode
 */

/**
 * @typedef {FileListParamsChangedAction
 *  | FileListDirChangedAction
 *  | FileListDirUpdatedAction
 *  | FileListItemCreatedAction
 *  | FileListDiskSpaceUpdatedAction
 *  | FileListSortAction
 * } FileListAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListParamsChangedAction";
 *  readonly offset: number;
 *  readonly index: number;
 *  readonly selectedNames: Set<string>;
 * }} FileListParamsChangedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDirChangedAction";
 *  readonly dir: string;
 *  readonly currDir: FileListDir;
 * }} FileListDirChangedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDirUpdatedAction";
 *  readonly currDir: FileListDir;
 * }} FileListDirUpdatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListItemCreatedAction";
 *  readonly name: string;
 *  readonly currDir: FileListDir;
 * }} FileListItemCreatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDiskSpaceUpdatedAction";
 *  readonly diskSpace: number;
 * }} FileListDiskSpaceUpdatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListSortAction";
 *  readonly mode: SortMode;
 * }} FileListSortAction
 */
