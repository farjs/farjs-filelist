/**
 * @import { Readable } from "stream"
 * @import { PromiseWithResolvers } from "../utils.mjs"
 */

import { newPromiseWithResolvers } from "../utils.mjs";

class StreamReader {
  /**
   * @param {Readable} readable
   */
  constructor(readable) {
    const self = this;

    /** @private @readonly @type {Readable} */
    this.readable = readable;

    /** @private @type {PromiseWithResolvers<boolean>} */
    this.ready = newPromiseWithResolvers();

    const readableListener = () => self.ready.resolve(false);
    /** @type {(error: Error) => void} */
    const errorListener = (error) => self.ready.reject(error);
    const endListener = () => {
      self.ready.resolve(true);
      readable.removeListener("readable", readableListener);
      readable.removeListener("error", errorListener);
    };
    readable.on("readable", readableListener);
    readable.on("error", errorListener);
    readable.once("end", endListener);
    readable.once("close", endListener);
  }

  /**
   * @param {number} size
   * @returns {Promise<Buffer | undefined>}
   */
  readNextBytes(size) {
    const self = this;

    /** @type {() => Promise<Buffer | undefined>} */
    function loop() {
      return self.ready.p.then((isEnd) => {
        if (isEnd) {
          return undefined;
        }

        /** @type {Buffer | null} */
        const content = self.readable.read(size);
        if (content !== null) {
          return content;
        }

        self.ready = newPromiseWithResolvers();
        return loop();
      });
    }

    return loop();
  }

  /**
   * @param {(line: string) => void} onNextLine
   * @returns {Promise<void>}
   */
  readAllLines(onNextLine) {
    /** @type {Buffer[]} */
    let chunks = [];

    /** @type {(buf: Buffer) => void} */
    function loopOverBuffer(buf) {
      while (true) {
        const newLineIndex = buf.indexOf("\n".charCodeAt(0), 0);
        if (newLineIndex < 0) {
          chunks.push(buf);
          return;
        }

        chunks.push(buf.subarray(0, newLineIndex));
        onNextLine(Buffer.concat(chunks).toString());
        chunks = [];

        buf = buf.subarray(newLineIndex + 1, buf.length);
      }
    }

    const self = this;

    /** @type {() => Promise<void>} */
    function loop() {
      return self.readNextBytes(16).then((buf) => {
        if (buf === undefined) {
          if (chunks.length > 0) {
            onNextLine(Buffer.concat(chunks).toString());
            chunks = [];
          }
          return undefined;
        }

        loopOverBuffer(buf);
        return loop();
      });
    }

    return loop();
  }
}

export default StreamReader;
