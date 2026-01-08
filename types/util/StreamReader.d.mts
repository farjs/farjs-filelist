export default StreamReader;
declare class StreamReader {
    /**
     * @param {Readable} readable
     */
    constructor(readable: Readable);
    /** @private @readonly @type {Readable} */
    private readonly readable;
    /** @private @type {PromiseWithResolvers<boolean>} */
    private ready;
    /**
     * @param {number} size
     * @returns {Promise<Buffer | undefined>}
     */
    readNextBytes(size: number): Promise<Buffer | undefined>;
    /**
     * @param {(line: string) => void} onNextLine
     * @returns {Promise<void>}
     */
    readAllLines(onNextLine: (line: string) => void): Promise<void>;
}
import type { Readable } from "stream";
//# sourceMappingURL=StreamReader.d.mts.map