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

/**
 * @typedef {{
 *  onKeyTrigger(key: string, stacks: WithStacksProps, data?: any): Promise<ReactComponent | undefined>;
 *  onFileTrigger(filePath: string, fileHeader: Uint8Array, onClose: () => void): Promise<PanelStackItem<FileListState> | undefined>;
 * }} IFileListPlugin
 */

/**
 * @implements {IFileListPlugin}
 */
class FileListPlugin {
  /** @type {IFileListPlugin['onKeyTrigger']} */
  onKeyTrigger() {
    return Promise.resolve(undefined);
  }

  /** @type {IFileListPlugin['onFileTrigger']} */
  onFileTrigger() {
    return Promise.resolve(undefined);
  }
}

export default FileListPlugin;
