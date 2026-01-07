import { deepEqual } from "node:assert/strict";
import mockFunction from "mock-fn";
import {
  isEqualSets,
  stripPrefix,
  lazyFn,
  stripSuffix,
  voidFn,
  newPromiseWithResolvers,
} from "../src/utils.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("utils.test.mjs", () => {
  it("should shallow compare two Sets when isEqualSets", () => {
    //given
    const set = new Set(["1"]);

    //when & then
    deepEqual(isEqualSets(set, set), true);
    deepEqual(isEqualSets(new Set(), new Set()), true);
    deepEqual(isEqualSets(new Set([1]), new Set([1])), true);
    deepEqual(isEqualSets(new Set([1, 2]), new Set([1, 2])), true);
    deepEqual(isEqualSets(new Set([1, 2]), new Set([2, 1])), true);
    deepEqual(isEqualSets(new Set([1]), new Set()), false);
    deepEqual(isEqualSets(new Set([1]), new Set([2])), false);
    deepEqual(isEqualSets(new Set([1, 2]), new Set([1, 3])), false);
    deepEqual(isEqualSets(new Set([1, 2]), new Set([2, 1, 3])), false);
  });

  it("should delete prfix from string when stripPrefix", () => {
    //when & then
    deepEqual(stripPrefix("", ""), "");
    deepEqual(stripPrefix("", "1"), "");
    deepEqual(stripPrefix("2", ""), "2");
    deepEqual(stripPrefix("2", "1"), "2");
    deepEqual(stripPrefix("2", "2"), "");
    deepEqual(stripPrefix("21", "2"), "1");
    deepEqual(stripPrefix("123", "12"), "3");
    deepEqual(stripPrefix("123", "23"), "123");
  });

  it("should delete suffix from string when stripSuffix", () => {
    //when & then
    deepEqual(stripSuffix("", ""), "");
    deepEqual(stripSuffix("", "1"), "");
    deepEqual(stripSuffix("2", ""), "2");
    deepEqual(stripSuffix("2", "1"), "2");
    deepEqual(stripSuffix("2", "2"), "");
    deepEqual(stripSuffix("12", "2"), "1");
    deepEqual(stripSuffix("123", "23"), "1");
    deepEqual(stripSuffix("123", "12"), "123");
  });

  it("should call callback only once and return cached value when lazyFn", () => {
    //given
    const initVal = "test";
    const callback = mockFunction(() => initVal);
    const lazyFunc = lazyFn(callback);

    //when & then
    deepEqual(lazyFunc() === initVal, true);
    deepEqual(lazyFunc() === initVal, true);
    deepEqual(lazyFunc() === initVal, true);
    deepEqual(callback.times, 1);
  });

  it("should do nothing and return undefined when voidFn", () => {
    //given
    /** @type {(a: string) => void} */
    const fn = voidFn;

    //when & then
    deepEqual(fn("") === undefined, true);
  });

  it("should return new Promise with resolve when newPromiseWithResolvers", async () => {
    //when & then
    const { p, resolve } = newPromiseWithResolvers();
    deepEqual(resolve !== voidFn, true);

    //given
    let completed = false;
    p.then(() => (completed = true));

    //when
    setTimeout(() => resolve(undefined)); // to make sure [p] is awaitable

    //then
    await p;
    deepEqual(completed, true);
  });

  it("should return new Promise with reject when newPromiseWithResolvers", async () => {
    //when & then
    const { p, reject } = newPromiseWithResolvers();
    deepEqual(reject !== voidFn, true);

    //given
    const error = Error("test error");
    let capturedError = null;
    p.catch((err) => (capturedError = err));

    //when
    setTimeout(() => reject(error)); // to make sure [p] is awaitable

    //then
    let resError = null;
    try {
      await p;
    } catch (error) {
      resError = error;
    }
    deepEqual(resError === error, true);
    deepEqual(capturedError === error, true);
  });
});
