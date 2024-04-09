import { FileListDir } from "./api/FileListDir";
import { FileListSort } from "./sort/FileListSort";

export interface FileListState {
  readonly offset: number;
  readonly index: number;
  readonly currDir: FileListDir;
  readonly selectedNames: Set<string>;
  readonly isActive: boolean;
  readonly diskSpace?: number;
  readonly sort: FileListSort;
}
