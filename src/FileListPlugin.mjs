/**
 * @typedef {import("./stack/WithStacks.mjs").WithStacksProps} WithStacksProps
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 * @typedef {import("./FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("./FileListData.mjs").ReactComponent} ReactComponent
 */
import PanelStackItem from "./stack/PanelStackItem.mjs";

/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  onClose(): void;
 * }} FileListPluginUiProps
 */

class FileListPlugin {
  /**
   * @param {string[]} triggerKeys
   */
  constructor(triggerKeys) {
    /** @readonly @type {string[]} */
    this.triggerKeys = triggerKeys;
  }

  /**
   * @param {string} key
   * @param {WithStacksProps} stacks
   * @param {any} [data]
   * @returns {Promise<ReactComponent | undefined>}
   */
  //@ts-ignore
  onKeyTrigger(key, stacks, data) {
    return Promise.resolve(undefined);
  }

  /**
   * @param {string} filePath
   * @param {Uint8Array} fileHeader
   * @param {() => void} onClose
   * @returns {Promise<PanelStackItem<FileListState> | undefined>}
   */
  //@ts-ignore
  onFileTrigger(filePath, fileHeader, onClose) {
    return Promise.resolve(undefined);
  }
}

export default FileListPlugin;
