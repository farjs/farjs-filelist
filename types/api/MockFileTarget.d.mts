export default MockFileTarget;
export type FileTarget = import("./FileListApi.mjs").FileTarget;
export type FileTargetMocks = {
    file?: FileTarget["file"];
    writeNextBytes?: FileTarget["writeNextBytes"];
    setAttributes?: FileTarget["setAttributes"];
    close?: FileTarget["close"];
    delete?: FileTarget["delete"];
};
/**
 * @typedef {import("./FileListApi.mjs").FileTarget} FileTarget
 */
/**
 * @typedef {{
 *  file?: FileTarget['file'],
 *  writeNextBytes?: FileTarget['writeNextBytes'],
 *  setAttributes?: FileTarget['setAttributes'],
 *  close?: FileTarget['close'],
 *  delete?: FileTarget['delete'],
 * }} FileTargetMocks
 */
/**
 * @implements {FileTarget}
 */
declare class MockFileTarget implements FileTarget {
    /**
     * @param {FileTargetMocks} mocks
     */
    constructor({ file, writeNextBytes, setAttributes, close, delete: deleteMock, }?: FileTargetMocks);
    file: string;
    writeNextBytes(buff: Uint8Array, length: number): Promise<number>;
    setAttributes(src: import("./FileListApi.mjs").FileListItem): Promise<void>;
    close(): Promise<void>;
    delete(): Promise<void>;
}
