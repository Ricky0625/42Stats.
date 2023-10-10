import { TextState } from "@/components/TextBasedContent";
import { BatchData } from "./blackholeData";


export const BlackholeContext = React.createContext<BlackholeState>({
    mbhd: 60,
    setMbhd: (mbhd: number) => { },
    data: [],
    batch: { year: 0, month: 0 },
    setBatch: (batch: BatchData) => { },
    viewState: TextState.WARNING,
    setViewState: (viewState: TextState) => { },
});
