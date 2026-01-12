import path from "path";
import fs from "fs";
import os from "os";
import { deepEqual } from "node:assert/strict";
import StreamReader from "../../src/util/StreamReader.mjs";
import { Readable } from "node:stream";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("StreamReader.test.mjs", () => {
  it("should fail with error when readNextBytes", async () => {
    //given
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "farjs-filelist-test-")
    );
    const file = path.join(tmpDir, "example.txt");
    fs.writeFileSync(file, "hello, World!!!");
    const readable = fs.createReadStream(file);
    const reader = new StreamReader(readable);
    const error = Error("test error");

    /** @type {(result: string) => Promise<string>} */
    async function loop(result) {
      const content = await reader.readNextBytes(5);
      if (content === undefined) {
        return result;
      }

      //when
      readable.destroy(error);

      return loop(result + content.toString());
    }
    const resultP = loop("");

    //then
    let resError = null;
    try {
      await resultP;
    } catch (error) {
      resError = error;
    }
    deepEqual(resError === error, true);

    //cleanup
    fs.unlinkSync(file);
    deepEqual(fs.existsSync(file), false);

    fs.rmdirSync(tmpDir);
    deepEqual(fs.existsSync(tmpDir), false);
  });

  it("should end stream without error when readNextBytes", async () => {
    //given
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "farjs-filelist-test-")
    );
    const file = path.join(tmpDir, "example.txt");
    fs.writeFileSync(file, "hello, World!!!");
    const readable = fs.createReadStream(file, {
      highWaterMark: 5,
    });
    const reader = new StreamReader(readable);

    /** @type {(result: string) => Promise<string>} */
    async function loop(result) {
      const content = await reader.readNextBytes(5);
      if (content === undefined) {
        return result;
      }
      deepEqual(content.length, 5);

      //when
      readable.destroy();

      return loop(result + content.toString());
    }
    const resultP = loop("");

    //then
    const result = await resultP;
    deepEqual(result, "hello");

    //cleanup
    fs.unlinkSync(file);
    deepEqual(fs.existsSync(file), false);

    fs.rmdirSync(tmpDir);
    deepEqual(fs.existsSync(tmpDir), false);
  });

  it("should read data fully when readNextBytes", async () => {
    //given
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "farjs-filelist-test-")
    );
    const file = path.join(tmpDir, "example.txt");
    fs.writeFileSync(file, "hello, World!!!");
    const readable = fs.createReadStream(file, {
      highWaterMark: 2,
    });
    const reader = new StreamReader(readable);

    /** @type {(result: string) => Promise<string>} */
    async function loop(result) {
      const content = await reader.readNextBytes(4);
      if (content === undefined) {
        return result;
      }

      deepEqual(content.length <= 4, true);
      return loop(result + content.toString());
    }

    //when
    const resultP = loop("");

    //then
    const result = await resultP;
    deepEqual(result, "hello, World!!!");

    //cleanup
    fs.unlinkSync(file);
    deepEqual(fs.existsSync(file), false);

    fs.rmdirSync(tmpDir);
    deepEqual(fs.existsSync(tmpDir), false);
  });

  it("should read all lines when readAllLines", async () => {
    //given
    StreamReader.readBufferSize = 16;
    const expectedContent = `some long text
,

more text at the end
`;
    const reader = new StreamReader(
      Readable.from(Buffer.from(expectedContent))
    );
    let result = "";

    //when
    await reader.readAllLines((line) => {
      deepEqual(line.includes("\n"), false);

      if (result !== "") {
        result = result + "\n";
      }
      result = result + line;
    });

    //then
    deepEqual(result, expectedContent);
  });

  it("should read single line if empty when readAllLines", async () => {
    //given
    StreamReader.readBufferSize = 16;
    const expectedContent = "";
    const reader = new StreamReader(
      Readable.from(Buffer.from(expectedContent))
    );
    let result = "";

    //when
    await reader.readAllLines((line) => {
      deepEqual(line.includes("\n"), false);

      if (result !== "") {
        result = result + "\n";
      }
      result = result + line;
    });

    //then
    deepEqual(result, expectedContent);
  });

  it("should read two lines when readAllLines", async () => {
    //given
    StreamReader.readBufferSize = 16;
    const expectedContent = "\n";
    const reader = new StreamReader(
      Readable.from(Buffer.from(expectedContent))
    );
    /** @type {string | undefined} */
    let result = undefined;

    //when
    await reader.readAllLines((line) => {
      deepEqual(line.includes("\n"), false);

      if (result !== undefined) {
        result = result + "\n";
      }
      result = (result ?? "") + line;
    });

    //then
    deepEqual(result, expectedContent);
  });
});
