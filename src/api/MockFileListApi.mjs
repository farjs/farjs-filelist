import FileListApi from "./FileListApi.mjs";

/**
 * @typedef {{
 *  isLocal?: FileListApi['isLocal'],
 *  capabilities?: FileListApi['capabilities'],
 *  readDir?: FileListApi['readDir'],
 *  delete?: FileListApi['delete'],
 *  mkDirs?: FileListApi['mkDirs'],
 *  readFile?: FileListApi['readFile'],
 *  writeFile?: FileListApi['writeFile'],
 *  getDriveRoot?: FileListApi['getDriveRoot'],
 * }} FileListApiMocks
 */

class MockFileListApi extends FileListApi {
  /**
   * @param {FileListApiMocks} mocks
   */
  constructor({
    isLocal,
    capabilities,
    readDir,
    delete: deleteMock,
    mkDirs,
    readFile,
    writeFile,
    getDriveRoot,
  } = {}) {
    super(isLocal ?? true, capabilities);

    this.readDir = readDir ?? this.readDir;
    this.delete = deleteMock ?? this.delete;
    this.mkDirs = mkDirs ?? this.mkDirs;
    this.readFile = readFile ?? this.readFile;
    this.writeFile = writeFile ?? this.writeFile;
    this.getDriveRoot = getDriveRoot ?? this.getDriveRoot;
  }

  /** @type {FileListApi['readDir']} */
  readDir() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileListApi['delete']} */
  delete() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileListApi['mkDirs']} */
  mkDirs() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileListApi['readFile']} */
  readFile() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileListApi['writeFile']} */
  writeFile() {
    return Promise.reject(new Error("Not implemented!"));
  }

  /** @type {FileListApi['getDriveRoot']} */
  getDriveRoot() {
    return Promise.reject(new Error("Not implemented!"));
  }
}

export default MockFileListApi;
