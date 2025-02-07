export default FileListPanelController;
export type FileListPanelProps = import("./FileListPanel.mjs").FileListPanelProps;
/**
 * @param {React.FunctionComponent<FileListPanelProps>
 *  | React.ComponentClass<FileListPanelProps>
 * } fileListPanelComp
 */
declare function FileListPanelController(fileListPanelComp: React.FunctionComponent<FileListPanelProps> | React.ComponentClass<FileListPanelProps>): {
    (): React.ReactElement<import("./FileListPanel.mjs").FileListPanelProps, string | React.JSXElementConstructor<any>> | null;
    displayName: string;
};
import React from "react";
