"use client"

import AvatarPic from "@/components/Avatar"
import CardDiv from "@/components/CardDiv"
import MilestoneForm from "@/components/MilestoneForm"
import LineChartGraph from "@/components/graphs/LineChartGraph"
import { Hash, LineChart, Link as LinkIcon, PersonStanding, User } from "lucide-react"
import Link from 'next/link'
import React from "react"
import { MilestoneData } from "./MilestoneData"
import { BatchData, StudentData } from "../blackhole/blackholeData"
import { toast } from "@/components/ui/use-toast"
import { MONTH } from "@/components/AvatarTooltip"
import MilestoneModeForm from "@/components/MilestoneModeForm"
import MilestoneBatchForm from "@/components/MilestoneBatchForm"

type MilestoneState = {
  login: string,
  setLogin: (login: string) => void
  milestoneData: MilestoneData | any
  mode: string
  setMode: (mode: string) => void
  batches: BatchData[]
  setBatches: (batches: BatchData[]) => void
}

export const MilestoneContext = React.createContext<MilestoneState>({
  login: "",
  setLogin: (login: string) => { },
  milestoneData: {},
  mode: "Student",
  setMode: (mode: string) => { },
  batches: [],
  setBatches: (batches: BatchData[]) => { }
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
    milestoneCtx.login === ""
      ? <></>
      : <div className="flex flex-col font-semibold text-lg text-foreground/50 space-y-2">
        <AvatarPic src={student.image} />
        <p className="truncate flex flex-row items-center"><User size={16} />&nbsp;<span className="font-black text-accent-foreground text-lg">{student.full_name}</span></p>
        <p className="truncate flex flex-row items-center"><LinkIcon size={16} />&nbsp;<span className="font-black text-accent-foreground text-lg"><Link href={`https://profile.intra.42.fr/users/${student.login}`} target="_blank">{student.login}</Link></span></p>
        <p className="truncate flex flex-row items-center"><Hash size={16}/>&nbsp;<span className="font-black text-accent-foreground text-lg">{MONTH[student.cp_batch_month - 1]} {student.cp_batch_year}</span></p>
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
          unit: 'month',
          displayFormats: {
            month: 'MMM YYYY'
          },
        }
      }
    }
  }
}

const ProgressGraph = () => {

  const milestoneCtx = React.useContext(MilestoneContext);
  const { milestoneData } = milestoneCtx;
  const [progressData, setProgressData] = React.useState<{
    labels: string[]
    datasets: object[]
  }>({
    labels: [],
    datasets: []
  })

  React.useEffect(() => {
    const { batch_avg_xp_timeline, student } = (milestoneData as MilestoneData);
    const labels: string[] = []
    const avgValues: object[] = []
    const studValues: object[] = []
    const datasets: object[] = []

    if (batch_avg_xp_timeline === undefined || student === undefined) return;

    const { xp_timeline } = student;

    if (xp_timeline === undefined) return;

    batch_avg_xp_timeline.forEach((data) => {
      labels.push(data.date)
      avgValues.push({
        x: data.date,
        y: data.xp
      })
    })

    xp_timeline.forEach((data) => {
      studValues.push({
        x: data.date,
        y: data.xp
      })
    })

    datasets.push({
      label: `${MONTH[student.cp_batch_month - 1]} ${student.cp_batch_year} Average Student XP Total`,
      data: avgValues,
      borderColor: '#6D28D9',
      backgroundColor: '#6D28D9'
    })

    datasets.push({
      label: `${student.login} XP Total`,
      data: studValues,
      borderColor: '#EA580C',
      backgroundColor: '#EA580C'
    })

    setProgressData({
      labels: labels,
      datasets: datasets
    })
  }, [milestoneCtx])

  return (
    <div className=" h-96">
      <LineChartGraph options={optionsDef} data={progressData} />
    </div>
  );
}

const statCards = [
  {
    title: "Student",
    description: undefined,
    icon: <PersonStanding size={20} />,
    content: <StudentInfoCard />,
    className: `col-span-3 md:col-span-2 lg:col-span-1`
  },
  {
    title: "Progress",
    description: undefined,
    icon: <LineChart size={20} />,
    content: <ProgressGraph />,
    className: `col-span-3`
  },
]

const getStudentProgress = async (mode: string, login: string, batches: BatchData[]) => {

  let URL = `/api/progress_stats`

  if (mode === "Student")
    URL = URL + `?comp_by=login&login=${login}`
  else
    URL = URL + `?comp_by=batch&batch_year1=${batches[0].year}&batch_year2=${batches[1].year}&batch_month1=${batches[0].month}&batch_month2=${batches[1].month}`
  
  const res = await fetch(URL);
  const resJson = await res.json();
  return resJson;
}

export default function MileStone() {

  const [mode, setMode] = React.useState("Student");
  const [login, setLogin] = React.useState("");
  const [milestoneData, setMilestoneData] = React.useState<any>({})
  const [batches, setBatches] = React.useState<BatchData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if ((mode === "Student" && login === "") || (mode === "Batch" && batches.length === 0)) return;
      return await getStudentProgress(mode, login, batches);
    }

    fetchData().then(res => {
      if (res === undefined) return
      if (res.error !== undefined) {
        return toast({
          title: "User not found!",
          description: `${login} does not exists!`,
        })
      }
      console.log(res);
      setMilestoneData(res)
    })
  }, [login, batches])

  React.useEffect(() => {
    console.log(batches);
  }, [batches])

  return (
    <MilestoneContext.Provider value={{
      login: login,
      setLogin: setLogin,
      milestoneData: milestoneData,
      mode: mode,
      setMode: setMode,
      batches: batches,
      setBatches: setBatches
    }}>
      <div className="container relative pt-6 max-h-screen">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Milestone Monitor</h2>
          <div className="flex flex-row justify-between">
            <MilestoneModeForm />
            {mode === "Student" ? <MilestoneForm /> : <MilestoneBatchForm />}
          </div>
        </div>
        {
          login === ""
            ? <p>Please select a student</p>
            : <div className="m-auto pt-3 grid grid-cols-3 auto-rows-max gap-4">
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