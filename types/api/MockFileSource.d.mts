export default MockFileSource;
export type FileSource = import("./FileListApi.mjs").FileSource;
export type FileSourceMocks = {
    file?: FileSource['file'];
    readNextBytes?: FileSource['readNextBytes'];
    close?: FileSource['close'];
};
/**
 * @typedef {import("./FileListApi.mjs").FileSource} FileSource
 */
/**
 * @typedef {{
 *  file?: FileSource['file'],
 *  readNextBytes?: FileSource['readNextBytes'],
 *  close?: FileSource['close'],
 * }} FileSourceMocks
 */
/**
 * @implements {FileSource}
 */
declare class MockFileSource implements FileSource {
    /**
     * @param {FileSourceMocks} mocks
     */
    constructor({ file, readNextBytes, close }?: FileSourceMocks);
    file: string;
    readNextBytes(buff: Uint8Array): Promise<number>;
    close(): Promise<void>;
}
