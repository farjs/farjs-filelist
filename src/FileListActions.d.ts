import { FileListDir } from "./api/FileListDir";
import { SortMode } from "./sort/SortMode.mjs";

export type FileListAction =
  | FileListAction.FileListParamsChangedAction
  | FileListAction.FileListDirChangedAction
  | FileListAction.FileListDirUpdatedAction
  | FileListAction.FileListItemCreatedAction
  | FileListAction.FileListDiskSpaceUpdatedAction
  | FileListAction.FileListSortAction;

export namespace FileListAction {
  interface FileListParamsChangedAction {
    readonly action: "FileListParamsChangedAction";
    readonly offset: number;
    readonly index: number;
    readonly selectedNames: Set<string>;
  }

  interface FileListDirChangedAction {
    readonly action: "FileListDirChangedAction";
    readonly dir: string;
    readonly currDir: FileListDir;
  }

  interface FileListDirUpdatedAction {
    readonly action: "FileListDirUpdatedAction";
    readonly currDir: FileListDir;
  }

  interface FileListItemCreatedAction {
    readonly action: "FileListItemCreatedAction";
    readonly name: string;
    readonly currDir: FileListDir;
  }

  interface FileListDiskSpaceUpdatedAction {
    readonly action: "FileListDiskSpaceUpdatedAction";
    readonly diskSpace: number;
  }

  interface FileListSortAction {
    readonly action: "FileListSortAction";
    readonly mode: SortMode;
  }
}
