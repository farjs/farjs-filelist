/**
 * @import { ExecOptions } from "child_process"
 * @import StreamReader from "../../src/util/StreamReader.mjs";
 */
import child_process from "child_process";
import { deepEqual } from "node:assert/strict";
import SubProcess from "../../src/util/SubProcess.mjs";
import ChildProcess from "../../src/util/ChildProcess.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

/** @type {ExecOptions} */
const defaultOpts = {
  windowsHide: true,
};

describe("ChildProcess.test.mjs", () => {
  it("should exec cd ..", async () => {
    //given
    const childP = ChildProcess.exec("cd ..", defaultOpts);
    deepEqual(!childP.child, false);

    //when
    const { stdout, stderr } = await childP;

    //then
    deepEqual(stdout, "");
    deepEqual(stderr, "");
  });

  it("should fail if unknown command when exec(123)", async () => {
    //given
    const childP = ChildProcess.exec("123", defaultOpts);
    deepEqual(!childP.child, false);

    let resError = null;
    try {
      //when
      await childP;
    } catch (error) {
      resError = error;
    }

    //then
    deepEqual(resError.code, 127);
    deepEqual(resError.message.includes("123: command not found"), true);
    deepEqual(resError.stdout, "");
    deepEqual(resError.stderr.includes("123: command not found"), true);
  });

  it("should spawn cd ..", async () => {
    //when
    const { stdout, exitP } = await SubProcess.wrap(
      child_process.spawn("cd", [".."], defaultOpts)
    );
    const output = await loop(stdout, "");

    //then
    deepEqual(output, "");

    //when
    await exitP;
  });
});

/**
 * @param {StreamReader} reader
 * @param {string} result
 * @returns {Promise<string>}
 */
function loop(reader, result) {
  return reader.readNextBytes(256).then((content) => {
    return content === undefined
      ? result
      : loop(reader, result + content.toString());
  });
}
