/**
 * @import { ChildProcess } from "child_process"
 * @import { PromiseWithResolvers } from "../utils.mjs"
 */
import { newPromiseWithResolvers } from "../utils.mjs";
import StreamReader from "./StreamReader.mjs";

/**
 * @typedef {{
 *  readonly child: ChildProcess;
 *  readonly stdout: StreamReader;
 *  readonly exitP: Promise<void>;
 * }} SubProcess
 */

const SubProcess = {
  /**
   * @param {ChildProcess} child
   * @returns {Promise<SubProcess>}
   */
  wrap: (child) => {
    const childStdout = child.stdout;
    const childStderr = child.stderr;
    if (childStdout === null || childStderr === null) {
      return Promise.reject(Error("Child process has no output streams"));
    }

    /** @type {PromiseWithResolvers<void>} */
    const exitPromise = newPromiseWithResolvers();
    child.once("exit", (code) => {
      if (code === 0) exitPromise.resolve();
      else exitPromise.reject(code);
    });

    let errored = false;

    /** @type {PromiseWithResolvers<SubProcess>} */
    const spawnPromise = newPromiseWithResolvers();
    child.once("error", (error) => {
      errored = true;
      spawnPromise.reject(error);
    });
    setImmediate(() => {
      if (!errored) {
        spawnPromise.resolve({
          child,
          stdout: new StreamReader(childStdout),
          exitP: exitPromise.p.catch(async (code) => {
            const stderr = new StreamReader(childStderr);
            let content;
            try {
              content = await stderr.readNextBytes(StreamReader.readBufferSize);
            } catch {
              content = undefined;
            }
            stderr.readable.destroy();
            throw Error(
              content !== undefined
                ? content.toString()
                : `sub-process exited with code=${code}
command:
${child.spawnargs.join(" ")}`
            );
          }),
        });
      }
    });

    return spawnPromise.p;
  },
};

export default SubProcess;
