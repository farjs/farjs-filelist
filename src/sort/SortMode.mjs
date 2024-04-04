/**
 * @typedef {"Name" | "Extension" | "ModificationTime" | "Size" | "Unsorted" | "CreationTime" | "AccessTime"} SortMode
 */

/** @type {SortMode} */
const Name = "Name";

/** @type {SortMode} */
const Extension = "Extension";

/** @type {SortMode} */
const ModificationTime = "ModificationTime";

/** @type {SortMode} */
const Size = "Size";

/** @type {SortMode} */
const Unsorted = "Unsorted";

/** @type {SortMode} */
const CreationTime = "CreationTime";

/** @type {SortMode} */
const AccessTime = "AccessTime";

const SortMode = Object.freeze({
  Name,
  Extension,
  ModificationTime,
  Size,
  Unsorted,
  CreationTime,
  AccessTime,
});

export default SortMode;
