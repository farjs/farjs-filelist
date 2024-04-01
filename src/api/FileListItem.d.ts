export interface FileListItem {
  readonly name: string;
  readonly isDir: boolean;
  readonly isSymLink: boolean;
  readonly size: number;
  readonly atimeMs: number;
  readonly mtimeMs: number;
  readonly ctimeMs: number;
  readonly birthtimeMs: number;
  /**
   * Format: `drwx---rwx`
   */
  readonly permissions: string;

  nameNormalized(): string;
  ext(): string;
  extNormalized(): string;

  toString(): string;
}
