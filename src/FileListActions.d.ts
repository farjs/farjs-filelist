export type FileListAction = FileListAction.FileListParamsChangedAction;

export namespace FileListAction {
  interface FileListParamsChangedAction {
    readonly action: "FileListParamsChangedAction";
    readonly offset: number;
    readonly index: number;
    readonly selectedNames: Set<string>;
  }
}
