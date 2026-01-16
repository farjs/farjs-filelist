export default SubProcess;
export type SubProcess = {
    readonly child: ChildProcess;
    readonly stdout: StreamReader;
    readonly exitP: Promise<void>;
};
declare namespace SubProcess {
    function wrap(child: ChildProcess): Promise<SubProcess>;
}
import type { ChildProcess } from "child_process";
import StreamReader from "./StreamReader.mjs";
//# sourceMappingURL=SubProcess.d.mts.map