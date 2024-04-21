/**
 * @typedef {import("./FileListApi").FileTarget} FileTarget
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
class MockFileTarget {
  /**
   * @param {FileTargetMocks} mocks
   */
  constructor({
    file,
    writeNextBytes,
    setAttributes,
    close,
    delete: deleteMock,
  } = {}) {
    this.file = file ?? "file.mock";
    this.writeNextBytes = writeNextBytes ?? this.writeNextBytes;
    this.setAttributes = setAttributes ?? this.setAttributes;
    this.close = close ?? this.close;
    this.delete = deleteMock ?? this.delete;
  }

  /** @type {FileTarget['writeNextBytes']} */
  writeNextBytes() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileTarget['setAttributes']} */
  setAttributes() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileTarget['close']} */
  close() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileTarget['delete']} */
  delete() {
    return Promise.reject(new Error("Not implemented!"));
  }
}

export default MockFileTarget;
