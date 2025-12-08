export default MockFileListApi;
export type FileListApiMocks = {
    isLocal?: FileListApi["isLocal"];
    capabilities?: FileListApi["capabilities"];
    readDir?: FileListApi["readDir"];
    delete?: FileListApi["delete"];
    mkDirs?: FileListApi["mkDirs"];
    readFile?: FileListApi["readFile"];
    writeFile?: FileListApi["writeFile"];
    getDriveRoot?: FileListApi["getDriveRoot"];
};
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
declare class MockFileListApi extends FileListApi {
    /**
     * @param {FileListApiMocks} mocks
     */
    constructor({ isLocal, capabilities, readDir, delete: deleteMock, mkDirs, readFile, writeFile, getDriveRoot, }?: FileListApiMocks);
}
import FileListApi from "./FileListApi.mjs";
//# sourceMappingURL=MockFileListApi.d.mts.map