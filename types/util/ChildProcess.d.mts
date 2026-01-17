export default ChildProcess;
declare namespace ChildProcess {
    function exec(command: string, options?: (ObjectEncodingOptions & child_process.ExecOptions) | undefined | null): child_process.PromiseWithChild<{
        stdout: string | Buffer;
        stderr: string | Buffer;
    }>;
}
import type { ObjectEncodingOptions } from "fs";
import child_process from "child_process";
//# sourceMappingURL=ChildProcess.d.mts.map