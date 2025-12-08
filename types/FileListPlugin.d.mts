export default FileListPlugin;
export type WithStacksProps = import("./stack/WithStacks.mjs").WithStacksProps;
export type FileListState = import("./FileListState.mjs").FileListState;
export type Dispatch = import("./FileListData.mjs").Dispatch;
export type ReactComponent = import("./FileListData.mjs").ReactComponent;
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
     * @param {readonly string[]} triggerKeys
     */
    constructor(triggerKeys: readonly string[]);
    /** @readonly @type {readonly string[]} */
    readonly triggerKeys: readonly string[];
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
import PanelStackItem from "./stack/PanelStackItem.mjs";
//# sourceMappingURL=FileListPlugin.d.mts.map