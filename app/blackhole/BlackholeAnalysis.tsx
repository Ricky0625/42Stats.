import CardDiv from "@/components/CardDiv"
import TabGroups from "@/components/TabGroup"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import BarChartGraph from "@/components/graphs/BarChartGraph"
import { FolderOpenDot, LineChart, Skull, Sword, Swords } from "lucide-react"
import React from "react"
import { BatchData, FallenStats, LastProjectStat, StudentData } from "./blackholeData"
import { BlackholeAnalysisContext, defaultFallenStat } from "./BlackholeContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import AvatarTooltip from "@/components/AvatarTooltip"

const getCadetEndLevelAfterBlackholed = async (batchYear?: number, batchMonth?: number) => {
  let URL = `/api/fallens_stats`;

  if (batchYear === 0 || batchMonth === 0) {
    const res = await fetch(URL);
    const resJson = await res.json();
    return resJson;
  }

  URL = URL + `?batch_year=${batchYear}&batch_month=${batchMonth}`
  const res = await fetch(URL);
  const resJson = await res.json();
  return resJson;
}

const DeadlistProject = () => {
  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [deadliest, setDeadliest] = React.useState({
    name: "",
    count: 0,
  });

  React.useEffect(() => {
    const { failed_last } = bhAnalysisCtx.fallenStats;

    if (failed_last === undefined || !(failed_last.length)) {
      setDeadliest({
        name: "",
        count: 0,
      })
      return;
    }

    let deadliestProject: LastProjectStat = failed_last[0]

    for (const project of failed_last) {
      if (project.students.length > deadliestProject.students.length)
        deadliestProject = project;
    }

    setDeadliest({
      name: deadliestProject.name,
      count: deadliestProject.students.length
    });

  }, [bhAnalysisCtx])

  return (
    <div className="flex flex-col space-y-3">
      {
        deadliest.name === ""
          ? <p className="text-foreground/40 font-semibold text-sm">No deadliest project</p>
          : <>
            <TextBasedContent content={deadliest.name} state={TextState.DESTRUCTIVE} />
            <p className="text-foreground/40 font-semibold text-sm">Harmed <span className="font-black animate-pulse text-destructive">{deadliest.count}</span> Cadets</p>
          </>
      }
    </div>
  )
}

const SpawnKill = () => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [spawnKillCount, setSpawnKillCount] = React.useState<number>(0);

  React.useEffect(() => {
    const { never_started } = bhAnalysisCtx.fallenStats;

    if (never_started === undefined) return;

    setSpawnKillCount(never_started.length);
  }, [bhAnalysisCtx])

  return (
    <div className="flex flex-col space-y-3 cursor-pointer" onClick={() => bhAnalysisCtx.setSelectedProject("Spawn-Kills")}>
      <TextBasedContent content={spawnKillCount.toString()} state={TextState.DESTRUCTIVE} />
      <p className="text-foreground/40 font-semibold text-sm">Cadets at Lvl.0 succumbed to the Blackhole</p>
    </div>
  )
}

const EndLevelBarChart = () => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [hasData, setHasData] = React.useState(true);
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
    const { end_levels_stats } = fallens_stats;

    if (end_levels_stats === undefined) return;

    end_levels_stats.forEach((stat) => {
      graphLabels.push(`lvl.${stat.level}`);
      dataValues.push(stat.students.length);
    })

    if (dataValues.length === 0) {
      setHasData(false);
    } else {
      setHasData(true);
    }

    datasets.push({
      label: "Count",
      data: dataValues,
      borderColor: '#6D28D9',
      backgroundColor: '#6D28D9'
    })

    setEndLevelData({
      labels: graphLabels,
      datasets: datasets
    })
  }, [bhAnalysisCtx])

  return (
    hasData === false
      ? <p className="text-foreground/40 font-semibold text-sm">Insufficient data to show</p>
      : <BarChartGraph data={endLevelData} />
  )
}

const ProjectRanking = ({
  name,
  count
}: {
  name: string,
  count: number
}) => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);

  return (
    <div className="flex flex-row justify-between w-full p-4 hover:bg-foreground hover:text-primary-foreground cursor-pointer rounded transition-all" onClick={() => bhAnalysisCtx.setSelectedProject(name)}>
      <p className="text-sm font-bold">{name}</p>
      <p className="text-md font-black">{count}</p>
    </div>
  )
}

const ProjectList = ({
  projects
}: {
  projects: LastProjectStat[]
}) => {
  return (
    <ScrollArea className="h-[250px] lg:h-[300px]">
      <div className="space-y-1">
        {
          projects.length === 0
            ? <p className="text-foreground/40 font-semibold text-sm">Nothing here</p>
            : projects.map((project, i) => (
              <ProjectRanking name={project.name} count={project.students.length} key={`${project.name}_${i}`} />
            ))}
      </div>
    </ScrollArea>
  )
}

const FinalProjectList = () => {

  const tabNames = ["Died after", "Died to"];
  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [lastValidatedProjects, setLastValidatedProjects] = React.useState<LastProjectStat[]>([]);
  const [lastAutoSubmittedProjects, setLastAutoSubmittedProjects] = React.useState<LastProjectStat[]>([]);

  React.useEffect(() => {
    const { validated_last, failed_last } = bhAnalysisCtx.fallenStats;

    if (validated_last === undefined || failed_last === undefined) return;

    validated_last.sort((a, b) => b.students.length - a.students.length)
    failed_last.sort((a, b) => b.students.length - a.students.length)
    setLastValidatedProjects(validated_last);
    setLastAutoSubmittedProjects(failed_last);
  }, [bhAnalysisCtx])

  React.useEffect(() => {
    bhAnalysisCtx.setSelectedTab(tabNames[0]);
  }, [])

  const triggerAction = (tabName: string) => {
    bhAnalysisCtx.setSelectedTab(tabName);
  }

  return (
    <TabGroups
      tabNames={tabNames}
      tabContents={[
        <ProjectList projects={lastValidatedProjects} />,
        <ProjectList projects={lastAutoSubmittedProjects} />,
      ]}
      triggerAction={triggerAction}
    />
  )
}

const ProjectCasualties = () => {

  const bhAnalysisCtx = React.useContext(BlackholeAnalysisContext);
  const [casualties, setCasualties] = React.useState<StudentData[]>([]);

  React.useEffect(() => {
    const { selectedTab, selectedProject, fallenStats } = bhAnalysisCtx;
    const dataset: LastProjectStat[] = selectedTab === "Died after" ? bhAnalysisCtx.fallenStats.validated_last : bhAnalysisCtx.fallenStats.failed_last

    if (selectedProject === "Spawn-Kills") {
      setCasualties(fallenStats.never_started);
      return;
    }

    if (dataset === undefined) return;

    const projectCasualties = dataset.find((proj: LastProjectStat) => {
      return proj.name === selectedProject;
    })

    if (projectCasualties === undefined) return;

    setCasualties(projectCasualties.students)
  }, [bhAnalysisCtx])

  return (
    <div className="flex flex-col space-y-4">
      {casualties.length === 0
        ? <p className="text-foreground/40 font-semibold text-sm">No victim yet hehe. Lucky.<span className="text-sm font-normal"><br />(ps: click on the project to see casualties)</span></p>
        : <>
          <p className="font-black text-lg text-orange">{bhAnalysisCtx.selectedProject}<span className="text-foreground/60 font-semibold text-sm"> 's victim</span></p>
          <ScrollArea className="h-[250px] lg:h-[300px]">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
              {casualties.map((stud: StudentData) => (
                <AvatarWithHoverCard src={stud.image} name={stud.login} intraName={stud.login} content={<AvatarTooltip {...stud} />} />
              ))}
            </div>
          </ScrollArea>
        </>
      }
    </div>
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
    className: `col-span-2 sm:col-span-1 lg:col-span-2`
  },
  {
    title: "Casualties",
    description: undefined,
    icon: <Swords size={20} />,
    content: <ProjectCasualties />,
    className: `lg:col-span-3`
  }
]

const BlackholeAnalysis = ({
  batch
}: {
  batch: BatchData
}) => {

  const [fallenStats, setFallenStats] = React.useState<FallenStats>(defaultFallenStat);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      return await getCadetEndLevelAfterBlackholed(batch.year, batch.month);
    }
    fetchData().then((res) => {
      const fallenStats = res as FallenStats;
      setFallenStats(fallenStats);

      if (fallenStats.validated_last === undefined || fallenStats.validated_last.length === 0) return;
    })
  }, [batch])

  return (
    <BlackholeAnalysisContext.Provider value={{
      fallenStats: fallenStats,
      selectedProject: selectedProject,
      setSelectedProject: setSelectedProject,
      selectedTab: selectedTab,
      setSelectedTab: setSelectedTab,
      batch: batch
    }}>
      <div className="m-auto pt-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 auto-rows-max gap-4">
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