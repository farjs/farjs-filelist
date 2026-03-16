export default FileListPlugin;
export type FileListPluginUiProps = {
    readonly dispatch: Dispatch;
    onClose(): void;
};
/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  onClose(): void;
 * }} FileListPluginUiProps
 */
declare class FileListPlugin {
    /**
     * @param {string} key
     * @param {WithStacksProps} stacks
     * @param {any} [data]
     * @returns {Promise<ReactComponent | undefined>}
     */
    onKeyTrigger(key: string, stacks: WithStacksProps, data?: any): Promise<ReactComponent | undefined>;
    /**
     * @param {string} filePath
     * @param {Uint8Array} fileHeader
     * @param {() => void} onClose
     * @returns {Promise<PanelStackItem<FileListState> | undefined>}
     */
    onFileTrigger(filePath: string, fileHeader: Uint8Array, onClose: () => void): Promise<PanelStackItem<FileListState> | undefined>;
}
import type { Dispatch } from "./FileListData.mjs";
import type { WithStacksProps } from "./stack/WithStacks.mjs";
import type { ReactComponent } from "./FileListData.mjs";
import PanelStackItem from "./stack/PanelStackItem.mjs";
import type { FileListState } from "./FileListState.mjs";
//# sourceMappingURL=FileListPlugin.d.mts.map