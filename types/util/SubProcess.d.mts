export class SubProcessError extends Error {
    /**
     * @param {number} exitCode
     * @param {string} [message]
     */
    constructor(exitCode: number, message?: string);
    /** @readonly @type {number} */
    readonly exitCode: number;
}
export default SubProcess;
export type SubProcess = {
    readonly child: ChildProcess;
    readonly stdout: StreamReader;
    readonly exitP: Promise<SubProcessError | undefined>;
};
declare namespace SubProcess {
    function wrap(child: ChildProcess): Promise<SubProcess>;
}
import type { ChildProcess } from "child_process";
import StreamReader from "./StreamReader.mjs";
//# sourceMappingURL=SubProcess.d.mts.map