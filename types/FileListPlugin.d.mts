export default FileListPlugin;
export type FileListPluginUiProps = {
    readonly dispatch: Dispatch;
    onClose(): void;
};
export type IFileListPlugin = {
    onKeyTrigger(key: string, stacks: WithStacksProps, data?: any): Promise<ReactComponent | undefined>;
    onFileTrigger(filePath: string, fileHeader: Uint8Array, onClose: () => void): Promise<PanelStackItem<FileListState> | undefined>;
};
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
declare class FileListPlugin implements IFileListPlugin {
    onKeyTrigger(key: string, stacks: WithStacksProps, data?: any): Promise<ReactComponent | undefined>;
    onFileTrigger(filePath: string, fileHeader: Uint8Array, onClose: () => void): Promise<PanelStackItem<FileListState> | undefined>;
}
import type { Dispatch } from "./FileListData.mjs";
import type { WithStacksProps } from "./stack/WithStacks.mjs";
import type { ReactComponent } from "./FileListData.mjs";
import PanelStackItem from "./stack/PanelStackItem.mjs";
import type { FileListState } from "./FileListState.mjs";
//# sourceMappingURL=FileListPlugin.d.mts.map