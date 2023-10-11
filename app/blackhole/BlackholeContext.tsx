import { TextState } from "@/components/TextBasedContent";
import { BatchData, BlackholeFallenStatState, BlackholeState, FallenStats } from "./blackholeData";
import React from "react";


export const defaultBlackhole: BlackholeState = {
  mbhd: 60,
  setMbhd: (mbhd: number) => { },
  data: [],
  batch: { year: 0, month: 0 },
  setBatch: (batch: BatchData) => { },
  viewState: TextState.WARNING,
  setViewState: (viewState: TextState) => { },
}

export const BlackholeContext = React.createContext<BlackholeState>(defaultBlackhole);

export const defaultFallenStat: FallenStats = {
  average_end_level: 0,
  end_levels_stats: [],
  failed_last: [],
  validated_last: [],
  never_started: []
}

export const BlackholeAnalysisContext = React.createContext<BlackholeFallenStatState>({
  fallenStats: defaultFallenStat,
  selectedProject: "",
  setSelectedProject: (proj: string) => {},
  selectedTab: "",
  setSelectedTab: (tab: string) => {},
  batch: {year: 0, month: 0}
})
