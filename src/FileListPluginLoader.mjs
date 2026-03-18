/**
 * @import { IFileListPlugin } from "./FileListPlugin.mjs"
 */
import { lazyFn } from "./utils.mjs";

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
function FileListPluginLoader(triggerKeys, load) {
  const lazyLoad = lazyFn(load);

  return {
    triggerKeys,

    /** @type {IFileListPlugin['onKeyTrigger']} */
    onKeyTrigger: async (key, stacks, data) => {
      const p = await lazyLoad();

      return p.onKeyTrigger(key, stacks, data);
    },

    /** @type {IFileListPlugin['onFileTrigger']} */
    onFileTrigger: async (filePath, fileHeader, onClose) => {
      const p = await lazyLoad();

      return p.onFileTrigger(filePath, fileHeader, onClose);
    },
  };
}

export default FileListPluginLoader;
