/**
 * @import { ChildProcess } from "child_process"
 * @import StreamReader from "../../src/util/StreamReader.mjs";
 */
import { Readable } from "stream";
import { deepEqual } from "node:assert/strict";
import SubProcess from "../../src/util/SubProcess.mjs";
import mockFunction from "mock-fn";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("SubProcess.test.mjs", () => {
  it("should fail if stdout is null when wrap", async () => {
    //given
    const child = /** @type {ChildProcess} */ ({ stdout: null });
    let resError = Error();

    try {
      //when
      await SubProcess.wrap(child);
    } catch (error) {
      resError = error;
    }

    //then
    deepEqual(resError.message, "Child process has no output streams");
  });

  it("should fail if stderr is null when wrap", async () => {
    //given
    const child = /** @type {ChildProcess} */ ({ stderr: null });
    let resError = Error();

    try {
      //when
      await SubProcess.wrap(child);
    } catch (error) {
      resError = error;
    }

    //then
    deepEqual(resError.message, "Child process has no output streams");
  });

  it("should return successful Promise when wrap", async () => {
    //given
    const expectedContent = "test content";
    const stdoutStream = Readable.from(Buffer.from(expectedContent));
    let onceArgs = /** @type {any[][]} */ ([]);
    const once = mockFunction((...args) => {
      onceArgs.push(args);
      return child;
    });
    const child = /** @type {any} */ ({
      stdout: stdoutStream,
      stderr: Readable.from(Buffer.from("")),
      once,
    });

    //when & then
    const result = await SubProcess.wrap(child);
    deepEqual(once.times, 2);
    deepEqual(onceArgs.length, 2);
    deepEqual(onceArgs[0][0], "exit");
    deepEqual(onceArgs[1][0], "error");
    const exitCallback = onceArgs[0][1];

    //when & then
    const output = await loop(result.stdout, "");
    deepEqual(output, expectedContent);

    //when & then
    exitCallback(0);
    deepEqual(result.child === child, true);
    deepEqual(result.stdout.readable === stdoutStream, true);
    await result.exitP;
  });

  it("should return rejected Promise if error when wrap", async () => {
    //given
    const error = Error("test error");
    let onceArgs = /** @type {any[][]} */ ([]);
    const once = mockFunction((...args) => {
      onceArgs.push(args);
      if (once.times === 2) {
        const errorCallback = args[1];
        setImmediate(() => {
          errorCallback(error);
        });
      }
      return child;
    });
    const child = /** @type {any} */ ({
      stdout: Readable.from(Buffer.from("")),
      stderr: Readable.from(Buffer.from("")),
      once,
    });

    //when & then
    let resError = null;
    try {
      await SubProcess.wrap(child);
    } catch (error) {
      resError = error;
    }
    deepEqual(resError === error, true);
    deepEqual(once.times, 2);
    deepEqual(onceArgs.length, 2);
    deepEqual(onceArgs[0][0], "exit");
    deepEqual(onceArgs[1][0], "error");
    const exitCallback = onceArgs[0][1];
    exitCallback(0);
  });

  it("should return rejected exit Promise with stderr when wrap", async () => {
    //given
    const expectedOutput = "test content";
    const expectedError = "test error";
    const stdoutStream = Readable.from(Buffer.from(expectedOutput));
    const stderrStream = Readable.from(Buffer.from(expectedError));
    let onceArgs = /** @type {any[][]} */ ([]);
    const once = mockFunction((...args) => {
      onceArgs.push(args);
      return child;
    });
    const child = /** @type {any} */ ({
      stdout: stdoutStream,
      stderr: stderrStream,
      once,
    });

    //when & then
    const result = await SubProcess.wrap(child);
    deepEqual(once.times, 2);
    deepEqual(onceArgs.length, 2);
    deepEqual(onceArgs[0][0], "exit");
    deepEqual(onceArgs[1][0], "error");
    const exitCallback = onceArgs[0][1];

    //when & then
    const output = await loop(result.stdout, "");
    deepEqual(output, expectedOutput);

    //when & then
    exitCallback(1);
    deepEqual(result.child === child, true);
    deepEqual(result.stdout.readable === stdoutStream, true);

    //when & then
    let resError = null;
    try {
      await result.exitP;
    } catch (error) {
      resError = error;
    }
    deepEqual(resError.message, expectedError);
  });

  it("should return rejected exit Promise with generic error when wrap", async () => {
    //given
    const expectedOutput = "test content";
    const stdoutStream = Readable.from(Buffer.from(expectedOutput));
    const stderrStream = Readable.from([]);
    let onceArgs = /** @type {any[][]} */ ([]);
    const once = mockFunction((...args) => {
      onceArgs.push(args);
      return child;
    });
    const child = /** @type {any} */ ({
      spawnargs: ["app", "arg1", "arg2"],
      stdout: stdoutStream,
      stderr: stderrStream,
      once,
    });

    //when & then
    const result = await SubProcess.wrap(child);
    deepEqual(once.times, 2);
    deepEqual(onceArgs.length, 2);
    deepEqual(onceArgs[0][0], "exit");
    deepEqual(onceArgs[1][0], "error");
    const exitCallback = onceArgs[0][1];

    //when & then
    const output = await loop(result.stdout, "");
    deepEqual(output, expectedOutput);

    //when & then
    exitCallback(1);
    deepEqual(result.child === child, true);
    deepEqual(result.stdout.readable === stdoutStream, true);

    //when & then
    let resError = null;
    try {
      await result.exitP;
    } catch (error) {
      resError = error;
    }
    deepEqual(
      resError.message,
      `sub-process exited with code=1
command:
app arg1 arg2`
    );
  });

  it("should return rejected exit Promise with recovered error when wrap", async () => {
    //given
    const expectedOutput = "test content";
    const stdoutStream = Readable.from(Buffer.from(expectedOutput));
    const stderrStream = Readable.from(Buffer.from(""));
    let onceArgs = /** @type {any[][]} */ ([]);
    const once = mockFunction((...args) => {
      onceArgs.push(args);
      return child;
    });
    const child = /** @type {any} */ ({
      spawnargs: ["app", "arg1", "arg2"],
      stdout: stdoutStream,
      stderr: stderrStream,
      once,
    });

    //when & then
    const result = await SubProcess.wrap(child);
    deepEqual(once.times, 2);
    deepEqual(onceArgs.length, 2);
    deepEqual(onceArgs[0][0], "exit");
    deepEqual(onceArgs[1][0], "error");
    const exitCallback = onceArgs[0][1];

    //when & then
    const output = await loop(result.stdout, "");
    deepEqual(output, expectedOutput);

    //given
    stderrStream.destroy(Error("test stream error"));

    //when & then
    exitCallback(1);
    deepEqual(result.child === child, true);
    deepEqual(result.stdout.readable === stdoutStream, true);

    //when & then
    let resError = null;
    try {
      await result.exitP;
    } catch (error) {
      resError = error;
    }
    deepEqual(
      resError.message,
      `sub-process exited with code=1
command:
app arg1 arg2`
    );
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
