export default FileListApi;
export type FileListDir = import("./FileListDir.mjs").FileListDir;
export type FileListItem = import("./FileListItem.mjs").FileListItem;
export type FileListCapability = import("./FileListCapability.mjs").FileListCapability;
export type FileSource = {
    readonly file: string;
    readNextBytes(buff: Uint8Array): Promise<number>;
    close(): Promise<void>;
};
export type FileTarget = {
    readonly file: string;
    writeNextBytes(buff: Uint8Array, length: number): Promise<number>;
    setAttributes(src: FileListItem): Promise<void>;
    close(): Promise<void>;
    delete(): Promise<void>;
};
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
declare class FileListApi {
    /**
     * @param {boolean} isLocal
     * @param {Set<FileListCapability>} capabilities
     */
    constructor(isLocal?: boolean, capabilities?: Set<FileListCapability>);
    /** @readonly @type {boolean} */
    readonly isLocal: boolean;
    /** @readonly @type {Set<FileListCapability>} */
    readonly capabilities: Set<FileListCapability>;
    /**
     * @param {string} path
     * @param {string} [dir]
     * @returns {Promise<FileListDir>}
     */
    readDir(path: string, dir?: string | undefined): Promise<FileListDir>;
    /**
     * @param {string} parent
     * @param {FileListItem[]} items
     * @returns {Promise<void>}
     */
    delete(parent: string, items: FileListItem[]): Promise<void>;
    /**
     * @param {string[]} dirs
     * @returns {Promise<string>}
     */
    mkDirs(dirs: string[]): Promise<string>;
    /**
     * @param {string} parent
     * @param {FileListItem} item
     * @param {number} position
     * @returns {Promise<FileSource>}
     */
    readFile(parent: string, item: FileListItem, position: number): Promise<FileSource>;
    /**
     * @param {string} parent
     * @param {string} fileName
     * @param {(item: FileListItem) => Promise<boolean | undefined>} onExists
     * @returns {Promise<FileTarget | undefined>}
     */
    writeFile(parent: string, fileName: string, onExists: (item: FileListItem) => Promise<boolean | undefined>): Promise<FileTarget | undefined>;
    /**
     * @param {string} path
     * @returns {Promise<string | undefined>}
     */
    getDriveRoot(path: string): Promise<string | undefined>;
}
