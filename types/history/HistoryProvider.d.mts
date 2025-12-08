export default HistoryProvider;
export type HistoryKind = {
    readonly name: string;
    readonly maxItemsCount: number;
};
export type History = {
    readonly item: string;
    readonly params?: object;
};
export type HistoryService = {
    getAll(): Promise<readonly History[]>;
    getOne(item: string): Promise<History | undefined>;
    save(h: History): Promise<void>;
};
export type HistoryProvider = {
    get(kind: HistoryKind): Promise<HistoryService>;
};
declare namespace HistoryProvider {
    let Context: React.Context<HistoryProvider | null>;
    function useHistoryProvider(): HistoryProvider;
}
import React from "react";
//# sourceMappingURL=HistoryProvider.d.mts.map