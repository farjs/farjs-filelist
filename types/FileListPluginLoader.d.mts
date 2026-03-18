export default FileListPluginLoader;
export type FileListPluginLoader = IFileListPlugin & {
    readonly triggerKeys: readonly string[];
};
/**
 * @typedef {IFileListPlugin & {
 *  readonly triggerKeys: readonly string[];
 * }} FileListPluginLoader
 */
/**
 * @param {readonly string[]} triggerKeys
 * @param {() => Promise<IFileListPlugin>} load
 * @returns {FileListPluginLoader}
 */
declare function FileListPluginLoader(triggerKeys: readonly string[], load: () => Promise<IFileListPlugin>): FileListPluginLoader;
import type { IFileListPlugin } from "./FileListPlugin.mjs";
//# sourceMappingURL=FileListPluginLoader.d.mts.map