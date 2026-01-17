/**
 * @import { ObjectEncodingOptions } from "fs"
 * @import { PromiseWithChild, ExecOptions } from "child_process"
 * @import { PromiseWithResolvers } from "../utils.mjs"
 */
import child_process from "child_process";
import { newPromiseWithResolvers } from "../utils.mjs";

const ChildProcess = {
  /**
   * @param {string} command
   * @param {(ObjectEncodingOptions & ExecOptions) | undefined | null} [options]
   * @returns {PromiseWithChild<{
   *  stdout: string | Buffer;
   *  stderr: string | Buffer;
   * }>}
   */
  exec: (command, options) => {
    /**
     * @type {PromiseWithResolvers<{
     *  stdout: string | Buffer;
     *  stderr: string | Buffer;
     * }>}
     */
    const childPromise = newPromiseWithResolvers();

    const child = child_process.exec(
      command,
      options,
      (/** @type {any} */ error, stdout, stderr) => {
        if (error !== null) {
          error.stdout = stdout;
          error.stderr = stderr;
          childPromise.reject(error);
          return;
        }

        childPromise.resolve({ stdout, stderr });
      }
    );

    const resultP = childPromise.p;
    //@ts-ignore
    resultP.child = child;
    //@ts-ignore
    return resultP;
  },
};

export default ChildProcess;
