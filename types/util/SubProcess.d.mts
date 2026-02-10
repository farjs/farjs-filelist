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
    readonly child: child_process.ChildProcess;
    readonly stdout: StreamReader;
    readonly exitP: Promise<SubProcessError | undefined>;
};
declare namespace SubProcess {
    let spawn: typeof child_process.spawn;
    function wrap(child: child_process.ChildProcess): Promise<SubProcess>;
}
import child_process from "child_process";
import StreamReader from "./StreamReader.mjs";
//# sourceMappingURL=SubProcess.d.mts.map