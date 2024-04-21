import { FileListItem } from "./FileListItem";

export interface FileSource {
  readonly file: string;
  readNextBytes(buff: Uint8Array): Promise<number>;
  close(): Promise<void>;
}

export interface FileTarget {
  readonly file: string;
  writeNextBytes(buff: Uint8Array, length: number): Promise<number>;
  setAttributes(src: FileListItem): Promise<void>;
  close(): Promise<void>;
  delete(): Promise<void>;
}
