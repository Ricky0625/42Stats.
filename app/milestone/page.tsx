"use client"

import AvatarPic from "@/components/Avatar"
import CardDiv from "@/components/CardDiv"
import MilestoneForm from "@/components/MilestoneForm"
import LineChartGraph from "@/components/graphs/LineChartGraph"
import { LineChart, Link as LinkIcon, PersonStanding, User } from "lucide-react"
import Link from 'next/link'
import React from "react"
import { MilestoneData } from "./MilestoneData"
import { StudentData } from "../blackhole/blackholeData"

type MilestoneState = {
  login: string,
  setLogin: (login: string) => void
  milestoneData: MilestoneData | any
}

export const MilestoneContext = React.createContext<MilestoneState>({
  login: "",
  setLogin: (login: string) => { },
  milestoneData: {}
});

const StudentInfoCard = () => {

  const milestoneCtx = React.useContext(MilestoneContext);
  const [student, setStudent] = React.useState<StudentData>({});
  
  React.useEffect(() => {
    const { milestoneData } = milestoneCtx; 
    if (milestoneData === undefined) return;
    const { student } = milestoneData as MilestoneData
    if (student === undefined) return;
    setStudent(student);
  }, [milestoneCtx.milestoneData])

  return (
    <div className="flex flex-col font-semibold text-lg text-foreground/50 space-y-2">
      <AvatarPic src={student.image} />
      <p className="truncate flex flex-row items-center"><User size={16} />&nbsp;<span className="font-black text-accent-foreground text-lg">{student.full_name}</span></p>
      <p className="truncate flex flex-row items-center"><LinkIcon size={16} />&nbsp;<span className="font-black text-accent-foreground text-lg"><Link href={`https://profile.intra.42.fr/users/${student.login}`} target="_blank">{student.login}</Link></span></p>
    </div>
  )
}

const optionsDef = {
  responsive: true,
  fill: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  options: {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        }
      }
    }
  }
}

const statCards = [
  {
    title: "Student",
    description: undefined,
    icon: <PersonStanding size={20} />,
    content: <StudentInfoCard />,
    className: `col-span-1`
  },
  {
    title: "Progress",
    description: undefined,
    icon: <LineChart size={20} />,
    content: <LineChartGraph data={{ labels: [1, 2, 3, 4], datasets: [] }} />,
    className: `col-span-2`
  },
]

const getStudentProgress = async (login: string) => {
  let URL = `/api/progress_stats?login=${login}`
  const res = await fetch(URL);
  const resJson = await res.json();
  return resJson;
}

export default function MileStone() {

  const [login, setLogin] = React.useState("");
  const [milestoneData, setMilestoneData] = React.useState<any>({})

  React.useEffect(() => {
    const fetchData = async () => {
      if (login === "") return;
      return await getStudentProgress(login);
    }

    fetchData().then(res => {
      setMilestoneData(res)
    });
  }, [login])

  React.useEffect(() => {
    console.log(milestoneData);
  }, [milestoneData])

  return (
    <MilestoneContext.Provider value={{
      login: login,
      setLogin: setLogin,
      milestoneData: milestoneData
    }}>
      <div className="container relative pt-6 max-h-screen">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Milestone Monitor</h2>
          <MilestoneForm />
        </div>
        {
          login === ""
            ? <p>Please select a student</p>
            : <div className="m-auto pt-3 grid grid-cols-2 auto-rows-max gap-4">
              {
                statCards.map((stat, i) => (
                  <div className={stat.className} key={`${stat.title}_${i}`}>
                    <CardDiv {...stat} />
                  </div>
                ))
              }
            </div>}
      </div>
    </MilestoneContext.Provider>
  )
}