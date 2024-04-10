class FileListActions {
  constructor() {
    if (new.target === FileListActions) {
      throw new TypeError(
        "Cannot construct FileListActions instances directly"
      );
    }
  }
}

export default FileListActions;
