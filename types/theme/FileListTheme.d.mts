export default FileListTheme;
export type Theme = import("@farjs/ui/theme/Theme.mjs").Theme;
export type ThemeStyle = import("@farjs/ui/theme/Theme.mjs").ThemeStyle;
export type ThemeEffects = import("@farjs/ui/theme/Theme.mjs").ThemeEffects;
export type FileListTheme = Theme & {
    readonly fileList: ThemeFileList;
};
export type ThemeFileList = {
    readonly archiveItem: ThemeEffects;
    readonly regularItem: ThemeEffects;
    readonly dirItem: ThemeEffects;
    readonly hiddenItem: ThemeEffects;
    readonly selectedItem: ThemeEffects;
    readonly header: ThemeStyle;
};
declare namespace FileListTheme {
    function useTheme(): FileListTheme;
    let defaultTheme: FileListTheme;
    let xterm256Theme: FileListTheme;
}
