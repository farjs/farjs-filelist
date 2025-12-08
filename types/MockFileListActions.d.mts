export default MockFileListActions;
export type FileListActionsMocks = {
    api?: FileListActions["api"];
    changeDir?: FileListActions["changeDir"];
    updateDir?: FileListActions["updateDir"];
    createDir?: FileListActions["createDir"];
    deleteItems?: FileListActions["deleteItems"];
    scanDirs?: FileListActions["scanDirs"];
    copyFile?: FileListActions["copyFile"];
};
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
declare class MockFileListActions extends FileListActions {
    /**
     * @param {FileListActionsMocks} mocks
     */
    constructor({ api, changeDir, updateDir, createDir, deleteItems, scanDirs, copyFile, }?: FileListActionsMocks);
}
import FileListActions from "./FileListActions.mjs";
//# sourceMappingURL=MockFileListActions.d.mts.map