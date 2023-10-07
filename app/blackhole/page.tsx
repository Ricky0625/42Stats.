"use client"

import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import BlackholeFilterForm from "@/components/BlackholeFilterForm"
import CardDiv from "@/components/CardDiv"
import Ranking from "@/components/Ranking"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import { AlertTriangle, LandPlot, Laugh, Orbit, Skull, Users2 } from "lucide-react"
import React, { Suspense, useEffect } from "react"
import Loading from "../loading"

type BlackholeData = {
  login: string;
  bhDays: number;
}

type BlackholeState = {
  mbhd: number;
  setMbhd(mbhd: number): void;
  data: BlackholeData[];
}

export const BlackholeContext = React.createContext<BlackholeState>({
  mbhd: 60,
  setMbhd: (mbhd: number) => {},
  data: []
});

const BlackholeUsers = () => {

  const { data } = React.useContext(BlackholeContext);
  const [toppers, setToppers] = React.useState<BlackholeData[]>([])

  useEffect(() => {
    const top10 = data.filter((bhData) => bhData.bhDays >= 0).sort((bhData1, bhData2) => (bhData1.bhDays - bhData2.bhDays)).slice(0, 10)
    setToppers(top10);
  }, [data])

  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
      {toppers.map((user, i) => (
        <Ranking key={`${i}topper`} login={user.login} bhDay={user.bhDays}/>
      ))}
    </div>
  )
}

const DangerZone = () => {

  const { data, mbhd } = React.useContext(BlackholeContext);
  const [dangers, setDangers] = React.useState<BlackholeData[]>([])

  useEffect(() => {
    const dangers = data.filter((bhData) => bhData.bhDays >= 0 && bhData.bhDays < mbhd)
    setDangers(dangers);
  }, [data])

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {dangers.map((user, i) => (
        <AvatarWithHoverCard key={`${i}danger`} src="https://github.com/shadcn.png" name={user.login} content={<></>} />
      ))}
    </div>
  )
}

const BlackholeStatContent = ({
  state = TextState.OK,
}: {
  state?: TextState,
}) => {

  const { data, mbhd } = React.useContext(BlackholeContext);
  const [value, setValue] = React.useState(0);

  const filterFunc = {
    "ok": (bhData: BlackholeData) => bhData.bhDays >= mbhd,
    "warning": (bhData: BlackholeData) => bhData.bhDays < mbhd && bhData.bhDays >= 0,
    "destructive": (bhData: BlackholeData) => bhData.bhDays < 0,
  }

  useEffect(() => {
    const key = state === TextState.OK ? "ok" : state === TextState.WARNING ? "warning" : "destructive";
    const count = data.filter(filterFunc[key]);
    console.log(key, count)
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
    className: `col-span-1 md:row-start-1 row-span-1`
  },
  {
    title: "Danger Cadets",
    description: undefined,
    icon: <AlertTriangle size={20} />,
    content: <BlackholeStatContent state={TextState.WARNING} />,
    footer: undefined,
    className: `col-span-1 md:row-start-2 row-span-1`
  },
  {
    title: "Fallen Soldiers",
    description: undefined,
    icon: <Skull size={20} />,
    content: <BlackholeStatContent state={TextState.DESTRUCTIVE} />,
    footer: undefined,
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
    content: <DangerZone />,
    footer: undefined,
    className: `col-span-1 row-span-3 lg:col-span-2`
  },
]

const getBlackholeUsers = async () => {
  const res = await fetch(`/api/blackhole`);
  const resJson = await res.json();
  return resJson;
}

export default function Blackhole() {

  const [mbhd, setMbhd] = React.useState(60);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      return await getBlackholeUsers()
    }

    fetchData().then((res) => {
      setData(res)
    })
  }, [mbhd])

  return (
    <BlackholeContext.Provider value={{
      mbhd: mbhd,
      setMbhd: setMbhd,
      data: data}}
    >
      <div className="container relative pt-6">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Blackhole</h2>
          <BlackholeFilterForm />
        </div>
        <Suspense fallback={<Loading />}>
          <div className="m-auto pt-6 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-rows-9 md:grid-rows-6 lg:grid-rows-5 gap-4">
            {statCards.map((stat, i) => (
              <div className={stat.className} key={i}>
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
                  title={stat.title}
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