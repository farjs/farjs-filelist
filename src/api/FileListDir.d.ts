import { FileListItem } from "./FileListItem";

export interface FileListDir {
  readonly path: string;
  readonly isRoot: boolean;
  readonly items: FileListItem[];
}
