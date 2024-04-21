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

    if (readDir) this.readDir = readDir;
    if (deleteMock) this.delete = deleteMock;
    if (mkDirs) this.mkDirs = mkDirs;
    if (readFile) this.readFile = readFile;
    if (writeFile) this.writeFile = writeFile;
    if (getDriveRoot) this.getDriveRoot = getDriveRoot;
  }
}

export default MockFileListApi;
