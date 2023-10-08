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
