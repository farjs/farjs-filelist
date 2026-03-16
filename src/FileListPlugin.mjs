/**
 * @import { WithStacksProps } from "./stack/WithStacks.mjs"
 * @import { FileListState } from "./FileListState.mjs"
 * @import { Dispatch } from "./FileListData.mjs"
 * @import { ReactComponent } from "./FileListData.mjs"
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
