export default FileListPluginLoader;
declare class FileListPluginLoader extends FileListPlugin {
    /**
     * @param {readonly string[]} triggerKeys
     * @param {() => Promise<FileListPlugin>} load
     */
    constructor(triggerKeys: readonly string[], load: () => Promise<FileListPlugin>);
    /** @readonly @type {readonly string[]} */
    readonly triggerKeys: readonly string[];
    /** @readonly @private @type {() => Promise<FileListPlugin>} */
    private readonly load;
}
import FileListPlugin from "./FileListPlugin.mjs";
//# sourceMappingURL=FileListPluginLoader.d.mts.map