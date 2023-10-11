import { StudentData } from "../blackhole/blackholeData"

export interface MilestoneData {
  student: StudentData
  batch_avg_xp_timeline: BatchAvgXpTimeline[]
}

export interface CurrProject {
  id: number
  name: string
}

export interface XpTimeline {
  xp: number
  date: string
}

export interface BatchAvgXpTimeline {
  xp: number
  date: string
}