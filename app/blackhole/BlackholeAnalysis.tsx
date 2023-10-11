import CardDiv from "@/components/CardDiv"
import TabGroups from "@/components/TabGroup"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import BarChartGraph from "@/components/graphs/BarChartGraph"
import { FolderOpenDot, LineChart, Skull, Sword } from "lucide-react"
import React from "react"
import { FallenStats, LastProjectStat } from "./blackholeData"
import { toast } from "@/components/ui/use-toast"
import { BlackholeAnalysisContext, defaultFallenStat } from "./BlackholeContext"
import TooltipText from "@/components/TooltipText"

const getCadetEndLevelAfterBlackholed = async () => {
  const res = await fetch(`/api/fallens_stats`);
  const resJson = await res.json();
  return resJson;
}

const DeadlistProject = () => {
  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [deadliest, setDeadliest] = React.useState<LastProjectStat>({
    name: "",
    students: []
  });

  React.useEffect(() => {
    const { failed_last, validated_last } = bhAnalysisCtx.fallenStats;

    if (!(failed_last.length || validated_last.length))
      return;

    const allFailedProjects: LastProjectStat[] = [...failed_last, ...validated_last]
    let deadliestProject: LastProjectStat = allFailedProjects[0]

    for (const project of allFailedProjects) {
      if (project.students.length > deadliestProject.students.length)
        deadliestProject = project;
    }
    setDeadliest(deadliestProject);
  }, [bhAnalysisCtx])

  return (
    <div className="flex flex-col space-y-3">
      <TextBasedContent content={deadliest.name} state={TextState.DESTRUCTIVE} />
      <p className="text-foreground/40 font-semibold text-sm">Harmed <span className="font-black animate-pulse text-destructive">{deadliest.students.length}</span> Cadets</p>
    </div>
  )
}

const SpawnKill = () => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [spawnKillCount, setSpawnKillCount] = React.useState<number>(0);

  React.useEffect(() => {
    const { never_started } = bhAnalysisCtx.fallenStats;
    setSpawnKillCount(never_started.length);
  }, [bhAnalysisCtx])

  return (
    <div className="flex flex-col space-y-3">
      <TextBasedContent content={spawnKillCount.toString()} state={TextState.DESTRUCTIVE} />
      <p className="text-foreground/40 font-semibold text-sm">Cadets fallen into blackhole at Lvl.0</p>
    </div>
  )
}

const EndLevelBarChart = () => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [endLevelData, setEndLevelData] = React.useState<{
    labels: string[]
    datasets: object[]
  }>({
    labels: [],
    datasets: []
  })

  React.useEffect(() => {
    const graphLabels: string[] = [];
    const dataValues: any[] = [];
    const datasets: object[] = [];
    const fallens_stats = bhAnalysisCtx.fallenStats;

    fallens_stats.end_levels_stats.forEach((stat) => {
      graphLabels.push(`lvl.${stat.level}`);
      dataValues.push(stat.students.length);
    })

    datasets.push({
      label: "Count",
      data: dataValues,
      borderColor: '#22C55E',
      backgroundColor: '#22C55E'
    })

    setEndLevelData({
      labels: graphLabels,
      datasets: datasets
    })
  }, [bhAnalysisCtx])

  return (<BarChartGraph data={endLevelData} />)
}

const FinalProjectList = () => {
  return (
    <TabGroups tabNames={["Validated", "Did not validated"]} tabContents={[<></>, <></>]} />
  )
}

const statCards = [
  {
    title: "Deadliest Project",
    description: undefined,
    icon: <Skull size={20} />,
    content: <DeadlistProject />,
    className: `col-span-1`
  },
  {
    title: "Blackhole Spawn-Kills",
    description: undefined,
    icon: <Sword size={20} />,
    content: <SpawnKill />,
    className: `col-span-1`
  },
  {
    title: "Count of Cadets by End Level before Blackhole",
    description: undefined,
    icon: <LineChart size={20} />,
    content: <EndLevelBarChart />,
    className: `col-span-2 lg:col-span-3`
  },
  {
    title: "Final project before Blackhole",
    description: undefined,
    icon: <FolderOpenDot size={20} />,
    content: <FinalProjectList />,
    className: `col-span-2`
  }
]

const BlackholeAnalysis = () => {

  const [fallenStats, setFallenStats] = React.useState<FallenStats>(defaultFallenStat);

  React.useEffect(() => {
    const fetchData = async () => {
      return await getCadetEndLevelAfterBlackholed();
    }

    fetchData().then((res) => {
      setFallenStats(res);
    }).catch(() => toast({
      title: "Failed to load data!",
    }))
  }, [])

  return (
    <BlackholeAnalysisContext.Provider value={{
      fallenStats: fallenStats
    }}>
      <div className="m-auto pt-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 md:grid-rows-3 gap-4">
        {statCards.map((stat, i) => (
          <div className={stat.className} key={`${stat.title}_${i}`}>
            <CardDiv
              title={stat.title}
              description={stat.description}
              icon={stat.icon}
              content={stat.content}
            />
          </div>
        ))}
      </div>
    </BlackholeAnalysisContext.Provider>
  )
}

export default BlackholeAnalysis