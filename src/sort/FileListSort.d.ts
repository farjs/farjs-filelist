import { SortMode } from "./SortMode.mjs";

export interface FileListSort {
  readonly mode: SortMode;
  readonly asc: boolean;
}
