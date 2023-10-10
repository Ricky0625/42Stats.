"use client"

import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import CardDiv from "@/components/CardDiv"
import OverviewFilterForm from "@/components/OverviewFilterForm"
import TextBasedContent from "@/components/TextBasedContent"
import TooltipText from "@/components/TooltipText"
import { GaugeCircle, Hash, Smile, Timer, Tractor, Users2 } from "lucide-react"
import React from "react"
import { ActiveUserData, BatchData } from "./blackhole/blackholeData"

type AvgLevelData = {
  avg_level: number
}

type OverviewState = {
  batch: BatchData;
  setBatch(batch: BatchData): void;
}

export const OverviewContext = React.createContext<OverviewState>({
  batch: { year: 0, month: 0 },
  setBatch: (batch: BatchData) => { },
});

const getAverageLevel = async (year?: number, month?: number) => {
  let URL = `/api/avg_level`

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

const AverageLevel = () => {

  const ovCtx = React.useContext(OverviewContext)
  const [averageLevel, setAverageLevel] = React.useState<AvgLevelData>({
    avg_level: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      return await getAverageLevel(ovCtx.batch.year, ovCtx.batch.month)
    }

    fetchData().then((res) => {
      setAverageLevel(res)
    })
  }, [ovCtx.batch])

  return (
    <TextBasedContent content={averageLevel.avg_level.toString()} />
  )
}

const AverageSessionTime = () => {
  return (
    <span className="inline-flex items-end">
      <TextBasedContent content="2.5" />
      <span className="text-sm pb-1 font-semibold text-primary">&nbsp;hr</span>
    </span>
  )
}

const CadetToPiscinersRatio = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="inline-flex items-center text-xl font-black text-foreground/40 w-full">
        <TooltipText content={<span className="text-4xl text-primary">20</span>} tooltip="Cadets" />
        &nbsp;:&nbsp;
        <TooltipText content={<span className="text-4xl text-primary">1</span>} tooltip="Pisciners" />
      </span>
    </div>
  )
}

const getActiveUsers = async (year?: number, month?: number) => {
  let URL = `/api/active_users`

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

const ActiveUsers = () => {

  const ovCtx = React.useContext(OverviewContext);
  const [activeUsers, setActiveUsers] = React.useState<ActiveUserData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      return await getActiveUsers(ovCtx.batch.year, ovCtx.batch.month)
    }

    fetchData().then((res) => {
      setActiveUsers(res)
    })
  }, [ovCtx.batch])

  return (
    activeUsers.length === 0
      ? <p>No active users</p>
      : <div className="grid md:grid-cols-8 grid-cols-3 sm:grid-cols-4 gap-3">
        {activeUsers.map((user, i) => (
          <AvatarWithHoverCard key={`active${i}`} src={user.image} intraName={user.login} name={user.login} content={<></>} />
        ))}
      </div>
  )
}

const statCards = [
  {
    title: "Average Level",
    description: undefined,
    icon: <GaugeCircle size={20} />,
    content: <AverageLevel />,
    footer: undefined,
    className: `col-span-1`
  },
  {
    title: "Average Session Time",
    description: undefined,
    icon: <Timer size={20} />,
    content: <AverageSessionTime />,
    footer: undefined,
    className: `col-span-1`
  },
  {
    title: "Cadet to Pisciners Ratio",
    description: undefined,
    icon: <Hash size={20} />,
    content: <CadetToPiscinersRatio />,
    footer: undefined,
    className: `col-span-1`
  },
  {
    title: "Top Zombies",
    description: undefined,
    icon: <Smile size={20} />,
    content: <></>,
    footer: undefined,
    className: `sm:col-span-2 lg:row-span-2`
  },
  {
    title: "Active Users",
    description: undefined,
    icon: <Users2 size={20} />,
    content: <ActiveUsers />,
    footer: undefined,
    className: `sm:col-span-2 lg:col-span-3 lg:row-span-3`
  },
  {
    title: "Top XP Farmers",
    description: undefined,
    icon: <Tractor size={20} />,
    content: undefined,
    footer: undefined,
    className: `sm:col-span-2 md:row-span-2 lg:col-start-4 row-start-4 md:row-start-3`
  },
]

// also known as Overview
export default function Home() {

  const [batch, setBatch] = React.useState<BatchData>({
    month: 0,
    year: 0,
  });

  return (
    <OverviewContext.Provider value={{
      batch: batch,
      setBatch: setBatch
    }}>
      <div className="container relative pt-6">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Overview</h2>
          <OverviewFilterForm />
        </div>
        <div className="m-auto pt-6 grid sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-4 gap-4">
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
        </div>
      </div>
    </OverviewContext.Provider>
  )
}
