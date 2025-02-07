/**
 * @typedef {import("./FileListPanel.mjs").FileListPanelProps} FileListPanelProps
 */
import React from "react";
import WithStack from "./stack/WithStack.mjs";

const h = React.createElement;

/**
 * @param {React.FunctionComponent<FileListPanelProps>
 *  | React.ComponentClass<FileListPanelProps>
 * } fileListPanelComp
 */
function FileListPanelController(fileListPanelComp) {
  const FileListPanelControllerComp = () => {
    const stackProps = WithStack.useStack();
    const stack = stackProps.stack;
    const stackItem = stack.peek();
    const data = stackItem.getData();

    if (data) {
      return h(fileListPanelComp, {
        dispatch: data.dispatch,
        actions: data.actions,
        state: data.state,
      });
    }
    return null;
  };

  FileListPanelControllerComp.displayName = "FileListPanelController";

  return FileListPanelControllerComp;
}

export default FileListPanelController;
