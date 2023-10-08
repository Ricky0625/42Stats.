"use client"

import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import BlackholeFilterForm from "@/components/BlackholeFilterForm"
import CardDiv from "@/components/CardDiv"
import Ranking from "@/components/Ranking"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import { AlertTriangle, LandPlot, Laugh, Orbit, Skull, ThumbsUp } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import Loading from "../loading"
import { UserData } from "./blackholeData"
import AvatarTooltip from "@/components/AvatarTooltip"

type BlackholeState = {
  mbhd: number;
  setMbhd(mbhd: number): void;
  data: UserData[];
  batch: BatchData
  setBatch(batch: BatchData): void;
  viewState: TextState
  setViewState(state: TextState): void;
}

type BatchData = {
  month: number,
  year: number,
}

export const BlackholeContext = React.createContext<BlackholeState>({
  mbhd: 60,
  setMbhd: (mbhd: number) => { },
  data: [],
  batch: { year: 0, month: 0 },
  setBatch: (batch: BatchData) => { },
  viewState: TextState.WARNING,
  setViewState: (viewState: TextState) => { },
});

const BlackholeUsers = () => {

  const { data } = React.useContext(BlackholeContext);
  const [toppers, setToppers] = React.useState<UserData[]>([])

  useEffect(() => {
    const top10 = data.filter((user) => user.bh_days >= 0).sort((userA, userB) => (userA.bh_days - userB.bh_days)).slice(0, 10)
    setToppers(top10);
  }, [data])

  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
      {toppers.map((user, i) => (
        <Ranking key={`${i}topper`} {...user} />
      ))}
    </div>
  )
}

const ZoneViewer = () => {

  const { data, mbhd, viewState } = React.useContext(BlackholeContext);
  const [users, setUsers] = React.useState<UserData[]>([])

  const filterFunc = {
    "ok": (user: UserData) => user.bh_days >= mbhd,
    "warning": (user: UserData) => user.bh_days < mbhd && user.bh_days >= 0,
    "destructive": (user: UserData) => user.bh_days < 0,
  }

  useEffect(() => {
    const key = viewState === TextState.OK ? "ok" : viewState === TextState.WARNING ? "warning" : "destructive";
    const users = data.filter(filterFunc[key]);
    setUsers(users);
  }, [data, viewState])

  return (
    users.length === 0
      ? <div className="grid place-items-center min-h-full text-sm pt-6"><ThumbsUp />No one is in the {`${viewState === TextState.OK ? "safe" : viewState === TextState.WARNING ? "danger" : "dead"}`} zone.</div>
      : <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {users.map((user, i) => (
          <AvatarWithHoverCard key={`${i}danger`} src={user.image} name={user.login} intraName={user.login} content={<AvatarTooltip {...user} />} />
        ))}
      </div>
  )
}

const BlackholeStatContent = ({
  state = TextState.OK,
}: {
  state?: TextState,
}) => {

  const { data, mbhd, setViewState } = React.useContext(BlackholeContext);
  const [value, setValue] = React.useState(0);

  const filterFunc = {
    "ok": (user: UserData) => user.bh_days >= mbhd,
    "warning": (user: UserData) => user.bh_days < mbhd && user.bh_days >= 0,
    "destructive": (user: UserData) => user.bh_days < 0,
  }

  useEffect(() => {
    const key = state === TextState.OK ? "ok" : state === TextState.WARNING ? "warning" : "destructive";
    const count = data.filter(filterFunc[key]);
    setValue(count.length)
  }, [data])

  return (
    <TextBasedContent content={value.toString()} state={state} />
  )
}

const statCards = [
  {
    title: "Safe Cadets",
    description: undefined,
    icon: <Laugh size={20} />,
    content: <BlackholeStatContent state={TextState.OK} />,
    footer: undefined,
    state: TextState.OK,
    className: `col-span-1 md:row-start-1 row-span-1`
  },
  {
    title: "Danger Cadets",
    description: undefined,
    icon: <AlertTriangle size={20} />,
    content: <BlackholeStatContent state={TextState.WARNING} />,
    footer: undefined,
    state: TextState.WARNING,
    className: `col-span-1 md:row-start-2 row-span-1`
  },
  {
    title: "Fallen Soldiers",
    description: undefined,
    icon: <Skull size={20} />,
    content: <BlackholeStatContent state={TextState.DESTRUCTIVE} />,
    footer: undefined,
    state: TextState.DESTRUCTIVE,
    className: `col-span-1 md:row-start-3 row-span-1`
  },
]

const blackholeList = [
  {
    title: "Blackhole Timer Toppers (TOP 10)",
    description: "Students who are on their journey into the Blackhole.",
    icon: <Orbit size={20} />,
    content: <BlackholeUsers />,
    footer: undefined,
    className: `col-span-1 row-span-3 md:row-span-4 lg:col-span-2`
  },
  {
    title: "In Danger Zone",
    description: "Time's ticking, but hope remains for our comrades!",
    icon: <LandPlot size={20} />,
    content: <ZoneViewer />,
    footer: undefined,
    className: `col-span-1 row-span-3 lg:col-span-2`
  },
]

const getBlackholeUsers = async (year?: number, month?: number) => {
  let URL = `/api/blackhole`

  if (month === 0 || year === 0) {
    const res = await fetch(URL);
    const resJson = await res.json();
    return resJson;
  }

  URL = URL + `?batch_year=${year}&batch_month=${month}`
  const res = await fetch(URL);
  const resJson = await res.json();
  return resJson;
}

export default function Blackhole() {

  const [mbhd, setMbhd] = React.useState(60);
  const [data, setData] = React.useState([]);
  const [viewState, setViewState] = React.useState(TextState.WARNING);
  const [batch, setBatch] = React.useState<BatchData>({
    month: 0,
    year: 0,
  });

  React.useEffect(() => {
    console.log(batch, mbhd)
    const fetchData = async () => {
      return await getBlackholeUsers(batch.year, batch.month)
    }

    fetchData().then((res) => {
      setData(res)
    })
  }, [mbhd, batch])

  return (
    <BlackholeContext.Provider value={{
      mbhd: mbhd,
      setMbhd: setMbhd,
      data: data,
      batch: batch,
      setBatch: setBatch,
      viewState: viewState,
      setViewState: setViewState,
    }}>
      <div className="container relative pt-6 max-h-screen">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Blackhole</h2>
          <BlackholeFilterForm />
        </div>
        <Suspense fallback={<Loading />}>
          <div className="m-auto pt-6 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-rows-9 md:grid-rows-6 lg:grid-rows-4 gap-4">
            {statCards.map((stat, i) => (
              <div className={stat.className + ` cursor-pointer`} key={i} onClick={() => setViewState(stat.state)}>
                <CardDiv
                  title={stat.title}
                  description={stat.description}
                  icon={stat.icon}
                  content={stat.content}
                  footer={stat.footer}
                />
              </div>
            ))}
            {blackholeList.map((stat, i) => (
              <div className={stat.className} key={i}>
                <CardDiv
                  title={i === 0 ? stat.title : viewState === TextState.OK ? "In Safe Zone" : viewState === TextState.WARNING ? "In Danger Zone" : "In Dead Zone"}
                  description={stat.description}
                  icon={stat.icon}
                  content={stat.content}
                  footer={stat.footer}
                />
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </BlackholeContext.Provider>
  )
}