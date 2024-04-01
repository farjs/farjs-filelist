/**
 * @typedef {import("./FileListItem").FileListItem} FileListItem
 */

/**
 * @param {string} name
 * @param {boolean} [isDir]
 * @returns {FileListItem}
 */
function FileListItem(name, isDir) {
  /** @type {string | null} */
  let _nameNormalized = null;

  function nameNormalized() {
    if (_nameNormalized === null) {
      _nameNormalized = name.toLowerCase();
    }
    return _nameNormalized;
  }

  /** @type {string | null} */
  let _ext = null;

  function ext() {
    if (_ext === null) {
      const dotIndex = name.lastIndexOf(".");
      if (dotIndex < 0) _ext = name;
      else _ext = name.slice(dotIndex + 1);
    }
    return _ext;
  }

  /** @type {string | null} */
  let _extNormalized = null;

  function extNormalized() {
    if (_extNormalized === null) {
      _extNormalized = ext().toLowerCase();
    }
    return _extNormalized;
  }

  return {
    name,
    isDir: !!isDir,
    isSymLink: false,
    size: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    permissions: "",
    nameNormalized,
    ext,
    extNormalized,
    toString: () => {
      return name;
    },
  };
}

/** @type {FileListItem} */
FileListItem.up = Object.freeze(FileListItem("..", true));

/** @type {FileListItem} */
FileListItem.currDir = Object.freeze(FileListItem(".", true));

export default FileListItem;
