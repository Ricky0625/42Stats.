import { TextState } from "@/components/TextBasedContent";

export type ProjectData = {
  id: number,
  name: string
}

export type UserData = {
  active: boolean;
  bh_days: number;
  cp_batch_month: number;
  cp_batch_year: number;
  cp_level: number;
  curr_projects: ProjectData[];
  email: string;
  eval_pts: number;
  full_name: string;
  image: string;
  login: string;
  ps_batch_month: number;
  ps_batch_year: number;
  ps_level: number;
  wallet: number;
}

export type BatchData = {
  month: number,
  year: number,
}

export type BlackholeState = {
  mbhd: number;
  setMbhd(mbhd: number): void;
  data: UserData[];
  batch: BatchData
  setBatch(batch: BatchData): void;
  viewState: TextState;
  setViewState(state: TextState): void;
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
