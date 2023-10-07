import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import CardDiv from "@/components/CardDiv"
import TextBasedContent from "@/components/TextBasedContent"
import TooltipText from "@/components/TooltipText"
import { GaugeCircle, Hash, Smile, Timer, Tractor, Users2 } from "lucide-react"

const AverageLevel = () => {
  return (
    <TextBasedContent content="3.7" />
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
        <TooltipText content={<span className="text-4xl text-primary">20</span>} tooltip="Cadets"/>
        &nbsp;:&nbsp;
        <TooltipText content={<span className="text-4xl text-primary">1</span>} tooltip="Pisciners"/>
      </span>
    </div>
  )
}

const ActiveUsers = () => {
  return (
    <div className="grid md:grid-cols-8 grid-cols-3 sm:grid-cols-4 gap-3">
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>}/>
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
    content: undefined,
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
  return (
    <div className="container relative pt-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Overview</h2>
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
  )
}
