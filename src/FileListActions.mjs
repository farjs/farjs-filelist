/**
 * @typedef {import("./api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("./api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("./api/FileListApi.mjs").FileTarget} FileTarget
 * @typedef {import("./sort/SortMode.mjs").SortMode} SortMode
 */
import nodePath from "path";
import Task from "@farjs/ui/task/Task.mjs";
import TaskAction from "@farjs/ui/task/TaskAction.mjs";
import FileListApi from "./api/FileListApi.mjs";

const copyBufferBytes = 64 * 1024;

class FileListActions {
  /**
   * @param {FileListApi} api
   */
  constructor(api) {
    /** @readonly @type {FileListApi} */
    this.api = api;
  }

  /**
   * @param {(a: FileListAction) => any} dispatch
   * @param {string} path
   * @param {string} dir
   * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
   */
  changeDir(dispatch, path, dir) {
    /** @type {Promise<FileListDir>} */
    const result = this.api.readDir(path, dir).then((currDir) => {
      dispatch({ action: "FileListDirChangedAction", dir, currDir });
      return currDir;
    });
    return TaskAction(Task("Changing Dir", result));
  }

  /**
   * @param {(a: FileListAction) => any} dispatch
   * @param {string} path
   * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
   */
  updateDir(dispatch, path) {
    /** @type {Promise<FileListDir>} */
    const result = this.api.readDir(path).then((currDir) => {
      dispatch({ action: "FileListDirUpdatedAction", currDir });
      return currDir;
    });
    return TaskAction(Task("Updating Dir", result));
  }

  /**
   * @param {(a: FileListAction) => any} dispatch
   * @param {string} parent
   * @param {string} dir
   * @param {boolean} multiple
   * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<FileListDir>}
   */
  createDir(dispatch, parent, dir, multiple) {
    const names = multiple ? dir.split(nodePath.sep) : [dir];

    /** @type {(api: FileListApi) => Promise<FileListDir>} */
    async function doCreate(api) {
      await api.mkDirs([parent, ...names]);
      const currDir = await api.readDir(parent);
      dispatch({
        action: "FileListItemCreatedAction",
        name: names[0],
        currDir,
      });
      return currDir;
    }

    return TaskAction(Task("Creating Dir", doCreate(this.api)));
  }

  /**
   * @param {(a: any) => any} dispatch
   * @param {string} parent
   * @param {readonly FileListItem[]} items
   * @returns {import("@farjs/ui/task/TaskAction.mjs").TaskAction<void>}
   */
  deleteItems(dispatch, parent, items) {
    /** @type {Promise<void>} */
    const result = this.api.delete(parent, items).then(() => {
      dispatch(this.updateDir(dispatch, parent));
    });
    return TaskAction(Task("Deleting Items", result));
  }

  /**
   * @param {string} parent
   * @param {readonly FileListItem[]} items
   * @param {(path: string, items: readonly FileListItem[]) => boolean} onNextDir
   * @returns {Promise<boolean>}
   */
  scanDirs(parent, items, onNextDir) {
    return items.reduce(async (resP, item) => {
      const res = await resP;
      if (res && item.isDir) {
        const ls = await this.api.readDir(parent, item.name);
        return onNextDir(ls.path, ls.items)
          ? await this.scanDirs(ls.path, ls.items, onNextDir)
          : false;
      }
      return res;
    }, Promise.resolve(true));
  }

  /**
   * @param {string} srcDir
   * @param {FileListItem} srcItem
   * @param {Promise<FileTarget | undefined>} dstFileP
   * @param {(pos: number) => Promise<boolean>} onProgress
   * @returns {Promise<boolean>}
   */
  async copyFile(srcDir, srcItem, dstFileP, onProgress) {
    const maybeTarget = await dstFileP;
    if (!maybeTarget) {
      return onProgress(srcItem.size);
    }
    const target = maybeTarget;

    return this.api
      .readFile(srcDir, srcItem, 0)
      .then((source) => {
        const buff = new Uint8Array(copyBufferBytes);

        /** @type {() => Promise<boolean>} */
        async function loop() {
          const bytesRead = await source.readNextBytes(buff);
          if (bytesRead === 0) {
            await target.setAttributes(srcItem);
            return true;
          }
          const position = await target.writeNextBytes(buff, bytesRead);
          const res = await onProgress(position);
          return res ? loop() : Promise.resolve(false);
        }

        return loop().finally(() => {
          return source.close().catch((err) => {
            console.log(
              `Failed to close srcFile: ${source.file}, error: ${err}`
            );
          });
        });
      })
      .finally(() => {
        return target.close().catch((err) => {
          console.log(`Failed to close dstFile: ${target.file}, error: ${err}`);
        });
      })
      .then(
        async (res) => {
          if (!res) {
            await target.delete();
          }
          return res;
        },
        async (err) => {
          await target.delete();
          return Promise.reject(err);
        }
      );
  }
}

export default FileListActions;

/**
 * @typedef {FileListParamsChangedAction
 *  | FileListDirChangedAction
 *  | FileListDirUpdatedAction
 *  | FileListItemCreatedAction
 *  | FileListDiskSpaceUpdatedAction
 *  | FileListSortAction
 * } FileListAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListParamsChangedAction";
 *  readonly offset: number;
 *  readonly index: number;
 *  readonly selectedNames: Set<string>;
 * }} FileListParamsChangedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDirChangedAction";
 *  readonly dir: string;
 *  readonly currDir: FileListDir;
 * }} FileListDirChangedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDirUpdatedAction";
 *  readonly currDir: FileListDir;
 * }} FileListDirUpdatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListItemCreatedAction";
 *  readonly name: string;
 *  readonly currDir: FileListDir;
 * }} FileListItemCreatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListDiskSpaceUpdatedAction";
 *  readonly diskSpace: number;
 * }} FileListDiskSpaceUpdatedAction
 */

/**
 * @typedef {{
 *  readonly action: "FileListSortAction";
 *  readonly mode: SortMode;
 * }} FileListSortAction
 */
