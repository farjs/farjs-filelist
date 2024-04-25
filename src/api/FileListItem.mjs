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
function FileListItem(name, isDir) {
  return {
    name,
    isDir: !!isDir,
    isSymLink: false,
    size: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    permissions: "",
  };
}

/** @type {FileListItem} */
FileListItem.up = Object.freeze(FileListItem("..", true));

/** @type {FileListItem} */
FileListItem.currDir = Object.freeze(FileListItem(".", true));

export default FileListItem;
