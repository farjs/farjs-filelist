import assert from "node:assert/strict";
import { isEqualSets, stripPrefix } from "../src/utils.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("utils.test.mjs", () => {
  it("should shallow compare two Sets when isEqualSets", async () => {
    //given
    const set = new Set(["1"]);

    //when & then
    assert.deepEqual(isEqualSets(set, set), true);
    assert.deepEqual(isEqualSets(new Set(), new Set()), true);
    assert.deepEqual(isEqualSets(new Set([1]), new Set([1])), true);
    assert.deepEqual(isEqualSets(new Set([1, 2]), new Set([1, 2])), true);
    assert.deepEqual(isEqualSets(new Set([1, 2]), new Set([2, 1])), true);
    assert.deepEqual(isEqualSets(new Set([1]), new Set()), false);
    assert.deepEqual(isEqualSets(new Set([1]), new Set([2])), false);
    assert.deepEqual(isEqualSets(new Set([1, 2]), new Set([1, 3])), false);
    assert.deepEqual(isEqualSets(new Set([1, 2]), new Set([2, 1, 3])), false);
  });

  it("should delete prfix from string when stripPrefix", async () => {
    //when & then
    assert.deepEqual(stripPrefix("", ""), "");
    assert.deepEqual(stripPrefix("", "1"), "");
    assert.deepEqual(stripPrefix("2", ""), "2");
    assert.deepEqual(stripPrefix("2", "1"), "2");
    assert.deepEqual(stripPrefix("2", "2"), "");
    assert.deepEqual(stripPrefix("21", "2"), "1");
    assert.deepEqual(stripPrefix("123", "12"), "3");
  });
});
