/**
 * @typedef {"read" | "write" | "delete" | "mkDirs" | "copyInplace" | "moveInplace"} FileListCapability
 */

const FileListCapability = Object.freeze({
  /** @type {FileListCapability} */
  read: "read",

  /** @type {FileListCapability} */
  write: "write",

  /** @type {FileListCapability} */
  delete: "delete",

  /** @type {FileListCapability} */
  mkDirs: "mkDirs",

  /** @type {FileListCapability} */
  copyInplace: "copyInplace",

  /** @type {FileListCapability} */
  moveInplace: "moveInplace",
});

export default FileListCapability;
