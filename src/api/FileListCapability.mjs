/**
 * @typedef {"read"
 *  | "write"
 *  | "delete"
 *  | "mkDirs"
 *  | "copyInplace"
 *  | "moveInplace"
 * } FileListCapability
 */

/** @type {FileListCapability} */
const read = "read";

/** @type {FileListCapability} */
const write = "write";

/** @type {FileListCapability} */
const deleteCapab = "delete";

/** @type {FileListCapability} */
const mkDirs = "mkDirs";

/** @type {FileListCapability} */
const copyInplace = "copyInplace";

/** @type {FileListCapability} */
const moveInplace = "moveInplace";

const FileListCapability = Object.freeze({
  read,
  write,
  delete: deleteCapab,
  mkDirs,
  copyInplace,
  moveInplace,
});

export default FileListCapability;
