export default FileListItem;
export type FileListItem = {
    readonly name: string;
    readonly isDir: boolean;
    readonly isSymLink: boolean;
    readonly size: number;
    readonly atimeMs: number;
    readonly mtimeMs: number;
    readonly ctimeMs: number;
    readonly birthtimeMs: number;
    readonly permissions: string;
};
/**
 * @typedef {{
 *  readonly name: string;
 *  readonly isDir: boolean;
 *  readonly isSymLink: boolean;
 *  readonly size: number;
 *  readonly atimeMs: number;
 *  readonly mtimeMs: number;
 *  readonly ctimeMs: number;
 *  readonly birthtimeMs: number;
 *  readonly permissions: string; //Format: `drwx---rwx`
 * }} FileListItem
 */
/**
 * @param {string} name
 * @param {boolean} [isDir]
 * @returns {FileListItem}
 */
declare function FileListItem(name: string, isDir?: boolean): FileListItem;
declare namespace FileListItem {
    let up: FileListItem;
    let currDir: FileListItem;
}
