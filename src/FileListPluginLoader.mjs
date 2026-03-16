import FileListPlugin from "./FileListPlugin.mjs";

class FileListPluginLoader extends FileListPlugin {
  /**
   * @param {readonly string[]} triggerKeys
   * @param {() => Promise<FileListPlugin>} load
   */
  constructor(triggerKeys, load) {
    super();

    /** @readonly @type {readonly string[]} */
    this.triggerKeys = triggerKeys;

    /** @readonly @private @type {() => Promise<FileListPlugin>} */
    this.load = load;
  }

  /** @type {FileListPlugin['onKeyTrigger']} */
  async onKeyTrigger(key, stacks, data) {
    const p = await this.load();

    return p.onKeyTrigger(key, stacks, data);
  }

  /** @type {FileListPlugin['onFileTrigger']} */
  async onFileTrigger(filePath, fileHeader, onClose) {
    const p = await this.load();

    return p.onFileTrigger(filePath, fileHeader, onClose);
  }
}

export default FileListPluginLoader;
