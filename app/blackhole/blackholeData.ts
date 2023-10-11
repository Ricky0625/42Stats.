import { TextState } from "@/components/TextBasedContent";
import { XpTimeline } from "../milestone/MilestoneData";

export interface CurrProject {
  id: number
  name: string
}

export interface LastProjectBeforeFall {
  id: number
  name: string
  validated: boolean
  score: number
}

export interface StudentData {
  login: string
  full_name: string
  email: string
  image?: string
  eval_pts: number
  wallet: number
  active: boolean
  bh_days?: number
  last_project_before_fall?: LastProjectBeforeFall
  ps_batch_year?: number
  ps_batch_month?: number
  ps_level?: number
  curr_projects: CurrProject[]
  cp_batch_year?: number
  cp_batch_month?: number
  cp_level?: number
  xp_timeline: XpTimeline[]
}

export type BatchData = {
  month: number,
  year: number,
}

export type BlackholeState = {
  mbhd: number;
  setMbhd(mbhd: number): void;
  data: StudentData[];
  batch: BatchData
  setBatch(batch: BatchData): void;
  viewState: TextState;
  setViewState(state: TextState): void;
}

export type BlackholeFallenStatState = {
  fallenStats: FallenStats
  selectedProject: string
  setSelectedProject: (proj: string) => void
  selectedTab: string
  setSelectedTab: (tab: string) => void
  batch: BatchData
}

export type ActiveUserData = {
  login: string,
  location: string,
  full_name: string,
  image: string,
  wallet: number,
  eval_pts: number,
  level: number,
  bh_days: number,
  cp_batch_year: number,
  cp_batch_month: number
}

export type LastProjectStat = {
  name: string,
  students: StudentData[],
}

export type EndLevelCount = {
  level: number
  students: StudentData[]
}

export type FallenStats = {
  average_end_level: number,
  end_levels_stats: EndLevelCount[],
  failed_last: LastProjectStat[],
  validated_last: LastProjectStat[],
  never_started: StudentData[],
}
