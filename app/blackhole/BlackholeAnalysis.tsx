import CardDiv from "@/components/CardDiv"
import TabGroups from "@/components/TabGroup"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import LineChartGraph from "@/components/graphs/LineChartGraph"
import { FolderOpenDot, LineChart, Skull, Sword } from "lucide-react"

const labels = ["lvl.1", "lvl.2", "lvl.3", "lvl.4", "lvl.5", "lvl.6", "lvl.7", "lvl.8", "lvl.9", "lvl.10"]

const data = {
  labels,
  datasets: [
    {
      label: 'Cadet Level',
      data: [20, 4, 26, 15, 25, 66, 36, 12, 8, 2, 0],
      borderColor: '#61BC66',
      backgroundColor: '#61BC66AA',
    },
  ],
}

const options = {
  responsive: true,
  fill: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      onClick: () => {},
    },
  },
}

const FinalProjectList = () => {
  return (
    <TabGroups tabNames={["Validated", "Did not validated"]} tabContents={[<></>,<></>]}/>
  )
}

const statCards = [
  {
    title: "Deadliest Project",
    description: undefined,
    icon: <Skull size={20} />,
    content: <TextBasedContent content="Libft" state={TextState.DESTRUCTIVE} />,
    className: `col-span-1`
  },
  {
    title: "Blackhole Spawn-Kills",
    description: undefined,
    icon: <Sword size={20} />,
    content: <TextBasedContent content="42" state={TextState.DESTRUCTIVE} />,
    className: `col-span-1`
  },
  {
    title: "Before the Blackhole: Cadet Levels",
    description: undefined,
    icon: <LineChart size={20} />,
    content: <LineChartGraph options={options} data={data} />,
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
  return (
    <div className="m-auto pt-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 md:grid-rows-3 gap-4">
      {statCards.map((stat, i) => (
        <div className={stat.className}>
          <CardDiv
            title={stat.title}
            description={stat.description}
            icon={stat.icon}
            content={stat.content}
          />
        </div>
      ))}
    </div>
  )
}

export default BlackholeAnalysis