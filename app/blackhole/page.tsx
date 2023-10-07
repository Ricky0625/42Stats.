"use client"

import AvatarWithHoverCard from "@/components/AvatarWithHoverCard"
import CardDiv from "@/components/CardDiv"
import Ranking from "@/components/Ranking"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import { AlertTriangle, LandPlot, Laugh, Orbit, Skull, Users2 } from "lucide-react"

const BlackholeUsers = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
      <Ranking />
    </div>
  )
}

const DangerZone = () => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
      <AvatarWithHoverCard src="https://github.com/shadcn.png" name="shadcn" content={<p>Hello</p>} />
    </div>
  )
}

const statCards = [
  {
    title: "Safe Cadets",
    description: undefined,
    icon: <Laugh size={20} />,
    content: <TextBasedContent content="20" />,
    footer: undefined,
    className: `col-span-1 md:row-start-1 row-span-1`
  },
  {
    title: "Danger Cadets",
    description: undefined,
    icon: <AlertTriangle size={20} />,
    content: <TextBasedContent content="20" state={TextState.WARNING} />,
    footer: undefined,
    className: `col-span-1 md:row-start-2 row-span-1`
  },
  {
    title: "Fallen Soldiers",
    description: undefined,
    icon: <Skull size={20} />,
    content: <TextBasedContent content="20" state={TextState.DESTRUCTIVE} />,
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
    className: `col-span-1 row-span-3 md:row-span-5 lg:row-span-6 lg:col-span-2`
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

export default function Blackhole() {
  return (
    <div className="container relative pt-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Blackhole</h2>
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
    </div>
  )
}