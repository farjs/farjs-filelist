/**
 * @typedef {import("./FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("./FileListCapability.mjs").FileListCapability} FileListCapability
 */

/**
 * @typedef {{
 *  readonly file: string;
 *  readNextBytes(buff: Uint8Array): Promise<number>;
 *  close(): Promise<void>;
 * }} FileSource
 */

/**
 * @typedef {{
 *  readonly file: string;
 *  writeNextBytes(buff: Uint8Array, length: number): Promise<number>;
 *  setAttributes(src: FileListItem): Promise<void>;
 *  close(): Promise<void>;
 *  delete(): Promise<void>;
 * }} FileTarget
 */

class FileListApi {
  /**
   * @param {boolean} isLocal
   * @param {Set<FileListCapability>} capabilities
   */
  constructor(isLocal = false, capabilities = new Set()) {
    if (new.target === FileListApi) {
      throw new TypeError(
        "Cannot construct FileListApi instances directly." +
          " Subclasses should at least implement readDir api."
      );
    }

    /** @readonly @type {boolean} */
    this.isLocal = isLocal;

    /** @readonly @type {Set<FileListCapability>} */
    this.capabilities = capabilities;
  }

  /**
   * @param {string} path
   * @param {string} [dir]
   * @returns {Promise<FileListDir>}
   */
  //@ts-ignore
  readDir(path, dir) {
    return Promise.reject(new Error("Not implemented!"));
  }

  /**
   * @param {string} parent
   * @param {FileListItem[]} items
   * @returns {Promise<void>}
   */
  //@ts-ignore
  delete(parent, items) {
    return Promise.reject(new Error("Not implemented!"));
  }

  /**
   * @param {string[]} dirs
   * @returns {Promise<string>}
   */
  //@ts-ignore
  mkDirs(dirs) {
    return Promise.reject(new Error("Not implemented!"));
  }

  /**
   * @param {string} parent
   * @param {FileListItem} item
   * @param {number} position
   * @returns {Promise<FileSource>}
   */
  //@ts-ignore
  readFile(parent, item, position) {
    return Promise.reject(new Error("Not implemented!"));
  }

  /**
   * @param {string} parent
   * @param {string} fileName
   * @param {(item: FileListItem) => Promise<boolean | undefined>} onExists
   * @returns {Promise<FileTarget | undefined>}
   */
  //@ts-ignore
  writeFile(parent, fileName, onExists) {
    return Promise.reject(new Error("Not implemented!"));
  }

  /**
   * @param {string} path
   * @returns {Promise<string | undefined>}
   */
  //@ts-ignore
  getDriveRoot(path) {
    return Promise.resolve(undefined);
  }
}

export default FileListApi;
