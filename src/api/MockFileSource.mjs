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
class MockFileSource {
  /**
   * @param {FileSourceMocks} mocks
   */
  constructor({ file, readNextBytes, close } = {}) {
    this.file = file ?? "file.mock";
    this.readNextBytes = readNextBytes ?? this.readNextBytes;
    this.close = close ?? this.close;
  }

  /** @type {FileSource['readNextBytes']} */
  readNextBytes() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileSource['close']} */
  close() {
    return Promise.reject(new Error("Not implemented!"));
  }
}

export default MockFileSource;
