/**
 * @typedef {import("../../src/api/FileListItem").FileListItem} FileListItem
 * @typedef {import("../../src/sort/SortMode.mjs").SortMode} SortMode
 * @typedef {import("../../src/sort/FileListSort").FileListSort} FileListSort
 */
import assert from "node:assert/strict";
import FileListItem from "../../src/api/FileListItem.mjs";
import SortMode from "../../src/sort/SortMode.mjs";
import FileListSort from "../../src/sort/FileListSort.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const {
  Name,
  Extension,
  ModificationTime,
  Size,
  Unsorted,
  CreationTime,
  AccessTime,
} = SortMode;

const { nextSort, sortItems } = FileListSort;

describe("FileListSort.test.mjs", () => {
  it("should return next sort ordering when nextSort", () => {
    //given
    /**
     * @param {FileListSort} sort
     * @param {SortMode} nextMode
     * @param {boolean} nextAsc
     */
    function check(sort, nextMode, nextAsc) {
      //when & then
      assert.deepEqual(nextSort(sort, nextMode), {
        mode: nextMode,
        asc: nextAsc,
      });
    }

    //when & then
    check({ mode: Name, asc: false }, Name, true);
    check({ mode: Name, asc: true }, Name, false);
    check({ mode: Unsorted, asc: false }, Name, true);
    check({ mode: Unsorted, asc: true }, Name, true);
    check({ mode: Name, asc: false }, Extension, true);
    check({ mode: Name, asc: true }, Extension, true);
    check({ mode: Name, asc: false }, Unsorted, true);
    check({ mode: Name, asc: true }, Unsorted, true);
    check({ mode: Extension, asc: false }, ModificationTime, false);
    check({ mode: Extension, asc: true }, ModificationTime, false);
    check({ mode: Name, asc: false }, Size, false);
    check({ mode: Name, asc: true }, Size, false);
    check({ mode: ModificationTime, asc: false }, CreationTime, false);
    check({ mode: ModificationTime, asc: true }, CreationTime, false);
    check({ mode: Unsorted, asc: false }, AccessTime, false);
    check({ mode: Unsorted, asc: true }, AccessTime, false);
  });

  //prettier-ignore
  it("should sort items when sortItems", () => {
    //given
    const item0 = {...FileListItem("item.bin"), size : 2, atimeMs : 1, mtimeMs : 4, ctimeMs : 2};
    const item1 = {...FileListItem("Item.bin"), size : 1, atimeMs : 1, mtimeMs : 3, ctimeMs : 2};
    const item2 = {...FileListItem("item2.BIN"), size : 4, atimeMs : 2, mtimeMs : 1, ctimeMs : 3};
    const item3 = {...FileListItem("Item3.zip"), size : 3, atimeMs : 4, mtimeMs : 2, ctimeMs : 4};
    const item4 = {...FileListItem("item4.ZIP"), size : 3, atimeMs : 3, mtimeMs : 2, ctimeMs : 1};
    const items = [item0, item1, item2, item3, item4];
    const itemsR = [...items].reverse();
    
    /**
     * @param {FileListItem[]} items
     * @param {SortMode} mode
     * @param {FileListItem[]} expectedItems
     */
    function check(items, mode, expectedItems) {
      //when
      const result = sortItems(items, mode);

      //then
      assert.deepEqual(result, expectedItems);
      //should always return new array, if sorted
      assert.deepEqual(result !== expectedItems, mode !== Unsorted);
    }

    //when & then
    check(items, Name, [item1, item0, item2, item3, item4]);
    check(itemsR, Name, [item1, item0, item2, item3, item4]);
    check(items, Extension, [item2, item1, item0, item4, item3]);
    check(itemsR, Extension, [item2, item1, item0, item4, item3]);
    check(items, ModificationTime, [item2, item3, item4, item1, item0]);
    check(itemsR, ModificationTime, [item2, item3, item4, item1, item0]);
    check(items, Size, [item1, item0, item3, item4, item2]);
    check(itemsR, Size, [item1, item0, item3, item4, item2]);
    check(items, Unsorted, items);
    check(itemsR, Unsorted, itemsR);
    check(items, CreationTime, [item4, item1, item0, item2, item3]);
    check(itemsR, CreationTime, [item4, item1, item0, item2, item3]);
    check(items, AccessTime, [item1, item0, item2, item4, item3]);
    check(itemsR, AccessTime, [item1, item0, item2, item4, item3]);
  });
});
