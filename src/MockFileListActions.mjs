import MockFileListApi from "./api/MockFileListApi.mjs";
import FileListActions from "./FileListActions.mjs";

/**
 * @typedef {{
 *  api?: FileListActions['api'];
 *  changeDir?: FileListActions['changeDir'];
 *  updateDir?: FileListActions['updateDir'];
 *  createDir?: FileListActions['createDir'];
 *  deleteItems?: FileListActions['deleteItems'];
 *  scanDirs?: FileListActions['scanDirs'];
 *  copyFile?: FileListActions['copyFile'];
 * }} FileListActionsMocks
 */

class MockFileListActions extends FileListActions {
  /**
   * @param {FileListActionsMocks} mocks
   */
  constructor({
    api,
    changeDir,
    updateDir,
    createDir,
    deleteItems,
    scanDirs,
    copyFile,
  } = {}) {
    super(api ?? new MockFileListApi());

    this.changeDir = changeDir ?? this.changeDir;
    this.updateDir = updateDir ?? this.updateDir;
    this.createDir = createDir ?? this.createDir;
    this.deleteItems = deleteItems ?? this.deleteItems;
    this.scanDirs = scanDirs ?? this.scanDirs;
    this.copyFile = copyFile ?? this.copyFile;
  }

  /** @type {FileListActions['changeDir']} */
  changeDir() {
    throw new Error("Not implemented!");
  }

  /** @type {FileListActions['updateDir']} */
  updateDir() {
    throw new Error("Not implemented!");
  }

  /** @type {FileListActions['createDir']} */
  createDir() {
    throw new Error("Not implemented!");
  }

  /** @type {FileListActions['deleteItems']} */
  deleteItems() {
    throw new Error("Not implemented!");
  }

  /** @type {FileListActions['scanDirs']} */
  scanDirs() {
    throw new Error("Not implemented!");
  }

  /** @type {FileListActions['copyFile']} */
  async copyFile() {
    throw new Error("Not implemented!");
  }
}

export default MockFileListActions;
