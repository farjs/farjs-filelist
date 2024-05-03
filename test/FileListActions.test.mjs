/**
 * @typedef {import("../src/api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("../src/FileListActions.mjs").FileListDirChangedAction} FileListDirChangedAction
 * @typedef {import("../src/FileListActions.mjs").FileListDirUpdatedAction} FileListDirUpdatedAction
 * @typedef {import("../src/FileListActions.mjs").FileListItemCreatedAction} FileListItemCreatedAction
 */
import path from "path";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import FileListDir from "../src/api/FileListDir.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import MockFileSource from "../src/api/MockFileSource.mjs";
import MockFileListApi from "../src/api/MockFileListApi.mjs";
import FileListActions from "../src/FileListActions.mjs";
import MockFileTarget from "../src/api/MockFileTarget.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListActions.test.mjs", () => {
  it("should dispatch FileListDirChangedAction when changeDir", async () => {
    //given
    const parent = "/";
    const dir = "test dir";
    const currDir = FileListDir("/", true, [FileListItem("file 1")]);
    const readDir = mockFunction((resParent, resDir) => {
      //then
      assert.deepEqual(resParent, parent);
      assert.deepEqual(resDir, dir);
      return Promise.resolve(currDir);
    });
    const actions = new FileListActions(new MockFileListApi({ readDir }));
    /** @type {FileListDirChangedAction} */
    const expected = { action: "FileListDirChangedAction", dir, currDir };
    const dispatch = mockFunction((action) => {
      //then
      assert.deepEqual(action, expected);
    });

    //when
    const { task } = actions.changeDir(dispatch, parent, dir);

    //then
    assert.deepEqual(task.message, "Changing Dir");
    assert.deepEqual(await task.result, currDir);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(dispatch.times, 1);
  });

  it("should dispatch FileListDirUpdatedAction when updateDir", async () => {
    //given
    const currDir = FileListDir("/", true, [FileListItem("file 1")]);
    const path = "/test/path";
    const readDir = mockFunction((resPath, resDir) => {
      //then
      assert.deepEqual(resPath, path);
      assert.deepEqual(resDir, undefined);
      return Promise.resolve(currDir);
    });
    const actions = new FileListActions(new MockFileListApi({ readDir }));
    /** @type {FileListDirUpdatedAction} */
    const expected = { action: "FileListDirUpdatedAction", currDir };
    const dispatch = mockFunction((action) => {
      //then
      assert.deepEqual(action, expected);
    });

    //when
    const { task } = actions.updateDir(dispatch, path);

    //then
    assert.deepEqual(task.message, "Updating Dir");
    assert.deepEqual(await task.result, currDir);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(dispatch.times, 1);
  });

  it("should dispatch FileListItemCreatedAction when createDir(multiple=false)", async () => {
    //given
    const currDir = FileListDir("/", true, [FileListItem("file 1")]);
    const parent = "/parent";
    const dir = "test/dir";
    const multiple = false;
    const mkDirs = mockFunction((dirs) => {
      //then
      assert.deepEqual(dirs, [parent, dir]);
      return Promise.resolve("");
    });
    const readDir = mockFunction((resPath, resDir) => {
      //then
      assert.deepEqual(resPath, parent);
      assert.deepEqual(resDir, undefined);
      return Promise.resolve(currDir);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readDir, mkDirs })
    );
    /** @type {FileListItemCreatedAction} */
    const expected = {
      action: "FileListItemCreatedAction",
      name: dir,
      currDir,
    };
    const dispatch = mockFunction((action) => {
      //then
      assert.deepEqual(action, expected);
    });

    //when
    const { task } = actions.createDir(dispatch, parent, dir, multiple);

    //then
    assert.deepEqual(task.message, "Creating Dir");
    assert.deepEqual(await task.result, currDir);
    assert.deepEqual(mkDirs.times, 1);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(dispatch.times, 1);
  });

  it("should dispatch FileListItemCreatedAction when createDir(multiple=true)", async () => {
    //given
    const currDir = FileListDir("/", true, [FileListItem("file 1")]);
    const parent = "parent";
    const dir = path.join("test", "dir");
    const multiple = true;
    const mkDirs = mockFunction((dirs) => {
      //then
      assert.deepEqual(dirs, [parent, "test", "dir"]);
      return Promise.resolve("");
    });
    const readDir = mockFunction((resPath, resDir) => {
      //then
      assert.deepEqual(resPath, parent);
      assert.deepEqual(resDir, undefined);
      return Promise.resolve(currDir);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readDir, mkDirs })
    );
    /** @type {FileListItemCreatedAction} */
    const expected = {
      action: "FileListItemCreatedAction",
      name: "test",
      currDir,
    };
    const dispatch = mockFunction((action) => {
      //then
      assert.deepEqual(action, expected);
    });

    //when
    const { task } = actions.createDir(dispatch, parent, dir, multiple);

    //then
    assert.deepEqual(task.message, "Creating Dir");
    assert.deepEqual(await task.result, currDir);
    assert.deepEqual(mkDirs.times, 1);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(dispatch.times, 1);
  });

  it("should dispatch FileListDirUpdatedAction when deleteItems", async () => {
    //given
    const currDir = FileListDir("/", true, [FileListItem("file 1")]);
    const dir = "test dir";
    const items = [FileListItem("file 1")];
    const deleteMock = mockFunction((resDir, resItems) => {
      //then
      assert.deepEqual(resDir, dir);
      assert.deepEqual(resItems, items);
      return Promise.resolve();
    });
    const readDir = mockFunction((resPath, resDir) => {
      //then
      assert.deepEqual(resPath, dir);
      assert.deepEqual(resDir, undefined);
      return Promise.resolve(currDir);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readDir, delete: deleteMock })
    );
    /** @type {FileListDirUpdatedAction} */
    const expected = {
      action: "FileListDirUpdatedAction",
      currDir,
    };
    /** @type {any} */
    let updateAction = null;
    const dispatch = mockFunction((action) => {
      //then
      if (dispatch.times === 1) {
        updateAction = action;
      } else {
        assert.deepEqual(action, expected);
      }
    });

    //when
    const { task } = actions.deleteItems(dispatch, dir, items);

    //then
    assert.deepEqual(task.message, "Deleting Items");
    assert.deepEqual(await task.result, undefined);
    assert.deepEqual(updateAction.task.message, "Updating Dir");
    assert.deepEqual(await updateAction.task.result, currDir);
    assert.deepEqual(deleteMock.times, 1);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(dispatch.times, 2);
  });

  it("should process sub-dirs and return true when scanDirs", async () => {
    //given
    const parent = "parent-dir";
    const res = FileListDir("dir1", false, [
      FileListItem("dir 3", true),
      FileListItem("file 4"),
    ]);
    const readDir = mockFunction((resPath, resDir) => {
      //then
      if (readDir.times === 1) {
        assert.deepEqual(resPath, parent);
        assert.deepEqual(resDir, "dir 1");
        return Promise.resolve(res);
      }
      assert.deepEqual(resPath, res.path);
      assert.deepEqual(resDir, "dir 3");
      return Promise.resolve(FileListDir("dir3", false, []));
    });
    const actions = new FileListActions(new MockFileListApi({ readDir }));
    const onNextDir = mockFunction((resPath, resItems) => {
      //then
      if (onNextDir.times === 1) {
        assert.deepEqual(resPath, res.path);
        assert.deepEqual(resItems, res.items);
        return true;
      }
      assert.deepEqual(resPath, "dir3");
      assert.deepEqual(resItems.length, 0);
      return true;
    });
    const items = [FileListItem("dir 1", true), FileListItem("file 2")];

    //when
    const result = await actions.scanDirs(parent, items, onNextDir);

    //then
    assert.deepEqual(result, true);
    assert.deepEqual(readDir.times, 2);
    assert.deepEqual(onNextDir.times, 2);
  });

  it("should process sub-dirs and return false when scanDirs", async () => {
    //given
    const parent = "parent-dir";
    const res = FileListDir("dir1", false, [
      FileListItem("dir 3", true),
      FileListItem("file 4"),
    ]);
    const readDir = mockFunction((resPath, resDir) => {
      //then
      assert.deepEqual(resPath, parent);
      assert.deepEqual(resDir, "dir 1");
      return Promise.resolve(res);
    });
    const actions = new FileListActions(new MockFileListApi({ readDir }));
    const onNextDir = mockFunction((resPath, resItems) => {
      //then
      assert.deepEqual(resPath, res.path);
      assert.deepEqual(resItems, res.items);
      return false;
    });
    const items = [FileListItem("dir 1", true), FileListItem("dir 2", true)];

    //when
    const result = await actions.scanDirs(parent, items, onNextDir);

    //then
    assert.deepEqual(result, false);
    assert.deepEqual(readDir.times, 1);
    assert.deepEqual(onNextDir.times, 1);
  });

  it("should copy new file when copyFile", async () => {
    //given
    const file = FileListItem("test_file");
    const position = 1234.0;
    const readNextBytes = mockFunction((buff) => {
      //then
      if (readNextBytes.times === 1) {
        assert.deepEqual(buff.length, 64 * 1024);
        return Promise.resolve(123);
      }
      return Promise.resolve(0);
    });
    const closeSource = mockFunction(() => Promise.resolve());
    const source = new MockFileSource({ readNextBytes, close: closeSource });

    const writeNextBytes = mockFunction((buff, length) => {
      //then
      assert.deepEqual(buff.length, 64 * 1024);
      assert.deepEqual(length, 123);
      return Promise.resolve(position);
    });
    const setAttributes = mockFunction((resFile) => {
      //then
      assert.deepEqual(resFile, file);
      return Promise.resolve();
    });
    const closeTarget = mockFunction(() => Promise.resolve());
    const target = new MockFileTarget({
      writeNextBytes,
      setAttributes,
      close: closeTarget,
    });

    const srcDir = "parent-dir";
    const dstDir = "target-dir";
    const dstName = "newName";

    const writeFile = mockFunction((resDir, resName, _) => {
      //then
      assert.deepEqual(resDir, dstDir);
      assert.deepEqual(resName, dstName);
      return Promise.resolve(target);
    });
    const readFile = mockFunction((resDir, resFile, pos) => {
      //then
      assert.deepEqual(resDir, srcDir);
      assert.deepEqual(resFile, file);
      assert.deepEqual(pos, 0);
      return Promise.resolve(source);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readFile, writeFile })
    );
    const onExists = mockFunction();
    const onProgress = mockFunction((resPos) => {
      //then
      assert.deepEqual(resPos, position);
      return Promise.resolve(true);
    });

    //when
    const result = await actions.copyFile(
      srcDir,
      file,
      writeFile(dstDir, dstName, onExists),
      onProgress
    );

    //then
    assert.deepEqual(result, true);
    assert.deepEqual(readNextBytes.times, 2);
    assert.deepEqual(closeSource.times, 1);
    assert.deepEqual(writeNextBytes.times, 1);
    assert.deepEqual(setAttributes.times, 1);
    assert.deepEqual(closeTarget.times, 1);
    assert.deepEqual(readFile.times, 1);
    assert.deepEqual(writeFile.times, 1);
    assert.deepEqual(onExists.times, 0);
    assert.deepEqual(onProgress.times, 1);
  });

  it("should overwrite existing file when copyFile", async () => {
    //given
    const file = FileListItem("test_file");
    const existing = { ...FileListItem("existing_file"), size: 12 };
    const position = 1234.0;
    const readNextBytes = mockFunction((buff) => {
      //then
      if (readNextBytes.times === 1) {
        assert.deepEqual(buff.length, 64 * 1024);
        return Promise.resolve(123);
      }
      return Promise.resolve(0);
    });
    const closeSource = mockFunction(() => Promise.resolve());
    const source = new MockFileSource({ readNextBytes, close: closeSource });

    const writeNextBytes = mockFunction((buff, length) => {
      //then
      assert.deepEqual(buff.length, 64 * 1024);
      assert.deepEqual(length, 123);
      return Promise.resolve(position);
    });
    const setAttributes = mockFunction((resFile) => {
      //then
      assert.deepEqual(resFile, file);
      return Promise.resolve();
    });
    const closeTarget = mockFunction(() => Promise.resolve());
    const target = new MockFileTarget({
      writeNextBytes,
      setAttributes,
      close: closeTarget,
    });

    const srcDir = "parent-dir";
    const dstDir = "target-dir";
    const dstName = "newName";

    const writeFile = mockFunction((resDir, resName, onExists) => {
      //then
      assert.deepEqual(resDir, dstDir);
      assert.deepEqual(resName, dstName);
      return onExists(existing).then(() => {
        return Promise.resolve(target);
      });
    });
    const readFile = mockFunction((resDir, resFile, pos) => {
      //then
      assert.deepEqual(resDir, srcDir);
      assert.deepEqual(resFile, file);
      assert.deepEqual(pos, 0.0);
      return Promise.resolve(source);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readFile, writeFile })
    );
    const onExists = mockFunction((item) => {
      //then
      assert.deepEqual(item, existing);
      return Promise.resolve(true);
    });
    const onProgress = mockFunction((resPos) => {
      //then
      assert.deepEqual(resPos, position);
      return Promise.resolve(true);
    });

    //when
    const result = await actions.copyFile(
      srcDir,
      file,
      writeFile(dstDir, dstName, onExists),
      onProgress
    );

    //then
    assert.deepEqual(result, true);
    assert.deepEqual(readNextBytes.times, 2);
    assert.deepEqual(closeSource.times, 1);
    assert.deepEqual(writeNextBytes.times, 1);
    assert.deepEqual(setAttributes.times, 1);
    assert.deepEqual(closeTarget.times, 1);
    assert.deepEqual(readFile.times, 1);
    assert.deepEqual(writeFile.times, 1);
    assert.deepEqual(onExists.times, 1);
    assert.deepEqual(onProgress.times, 1);
  });

  it("should call onProgress(file.size) if skip existing when copyFile", async () => {
    //given
    const file = { ...FileListItem("test_file"), size: 123 };
    const existing = { ...FileListItem("existing_file"), size: 12 };
    const srcDir = "parent-dir";
    const dstDir = "target-dir";
    const dstName = "newName";

    const writeFile = mockFunction((resDir, resName, onExists) => {
      //then
      assert.deepEqual(resDir, dstDir);
      assert.deepEqual(resName, dstName);
      return onExists(existing);
    });
    const actions = new FileListActions(new MockFileListApi({ writeFile }));
    const onExists = mockFunction((item) => {
      //then
      assert.deepEqual(item, existing);
      return Promise.resolve(undefined);
    });
    const onProgress = mockFunction((resPos) => {
      //then
      assert.deepEqual(resPos, file.size);
      return Promise.resolve(false);
    });

    //when
    const result = await actions.copyFile(
      srcDir,
      file,
      writeFile(dstDir, dstName, onExists),
      onProgress
    );

    //then
    assert.deepEqual(result, false);
    assert.deepEqual(writeFile.times, 1);
    assert.deepEqual(onExists.times, 1);
    assert.deepEqual(onProgress.times, 1);
  });

  it("should return false and delete target file if cancelled when copyFile", async () => {
    //given
    const file = FileListItem("test_file");
    const position = 1234.0;
    const readNextBytes = mockFunction((buff) => {
      //then
      assert.deepEqual(buff.length, 64 * 1024);
      return Promise.resolve(123);
    });
    const closeSource = mockFunction(() => Promise.resolve());
    const source = new MockFileSource({ readNextBytes, close: closeSource });

    const writeNextBytes = mockFunction((buff, length) => {
      //then
      assert.deepEqual(buff.length, 64 * 1024);
      assert.deepEqual(length, 123);
      return Promise.resolve(position);
    });
    const closeTarget = mockFunction(() => Promise.resolve());
    const deleteTarget = mockFunction(() => Promise.resolve());
    const target = new MockFileTarget({
      writeNextBytes,
      close: closeTarget,
      delete: deleteTarget,
    });

    const srcDir = "parent-dir";
    const dstDir = "target-dir";
    const dstName = "newName";

    const writeFile = mockFunction((resDir, resName, _) => {
      //then
      assert.deepEqual(resDir, dstDir);
      assert.deepEqual(resName, dstName);
      return Promise.resolve(target);
    });
    const readFile = mockFunction((resDir, resFile, pos) => {
      //then
      assert.deepEqual(resDir, srcDir);
      assert.deepEqual(resFile, file);
      assert.deepEqual(pos, 0.0);
      return Promise.resolve(source);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readFile, writeFile })
    );
    const onExists = mockFunction();
    const onProgress = mockFunction((resPos) => {
      //then
      assert.deepEqual(resPos, position);
      return Promise.resolve(false);
    });

    //when
    const result = await actions.copyFile(
      srcDir,
      file,
      writeFile(dstDir, dstName, onExists),
      onProgress
    );

    //then
    assert.deepEqual(result, false);
    assert.deepEqual(readNextBytes.times, 1);
    assert.deepEqual(closeSource.times, 1);
    assert.deepEqual(writeNextBytes.times, 1);
    assert.deepEqual(closeTarget.times, 1);
    assert.deepEqual(deleteTarget.times, 1);
    assert.deepEqual(readFile.times, 1);
    assert.deepEqual(writeFile.times, 1);
    assert.deepEqual(onExists.times, 0);
    assert.deepEqual(onProgress.times, 1);
  });

  it("should return rejected Promise and delete target file if failed when copyFile", async () => {
    //given
    const file = FileListItem("test_file");
    const error = new Error("test error");
    const readNextBytes = mockFunction((buff) => {
      //then
      assert.deepEqual(buff.length, 64 * 1024);
      return Promise.reject(error);
    });
    const closeSource = mockFunction(() => Promise.resolve());
    const source = new MockFileSource({ readNextBytes, close: closeSource });

    const closeTarget = mockFunction(() => Promise.resolve());
    const deleteTarget = mockFunction(() => Promise.resolve());
    const target = new MockFileTarget({
      close: closeTarget,
      delete: deleteTarget,
    });

    const srcDir = "parent-dir";
    const dstDir = "target-dir";
    const dstName = "newName";

    const writeFile = mockFunction((resDir, resName, _) => {
      //then
      assert.deepEqual(resDir, dstDir);
      assert.deepEqual(resName, dstName);
      return Promise.resolve(target);
    });
    const readFile = mockFunction((resDir, resFile, pos) => {
      //then
      assert.deepEqual(resDir, srcDir);
      assert.deepEqual(resFile, file);
      assert.deepEqual(pos, 0.0);
      return Promise.resolve(source);
    });
    const actions = new FileListActions(
      new MockFileListApi({ readFile, writeFile })
    );
    const onExists = mockFunction();
    const onProgress = mockFunction();

    //when
    let resError = undefined;
    try {
      await actions.copyFile(
        srcDir,
        file,
        writeFile(dstDir, dstName, onExists),
        onProgress
      );
    } catch (err) {
      resError = err;
    }

    //then
    assert.deepEqual(resError, error);
    assert.deepEqual(readNextBytes.times, 1);
    assert.deepEqual(closeSource.times, 1);
    assert.deepEqual(closeTarget.times, 1);
    assert.deepEqual(deleteTarget.times, 1);
    assert.deepEqual(readFile.times, 1);
    assert.deepEqual(writeFile.times, 1);
    assert.deepEqual(onExists.times, 0);
    assert.deepEqual(onProgress.times, 0);
  });
});
