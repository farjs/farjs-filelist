/**
 * @typedef {"onFileListCopy"
 *  | "onFileListMove"
 * } FileListEvent
 */

/** @type {FileListEvent} */
const onFileListCopy = "onFileListCopy";

/** @type {FileListEvent} */
const onFileListMove = "onFileListMove";

const FileListEvent = Object.freeze({
  onFileListCopy,
  onFileListMove,
});

export default FileListEvent;
