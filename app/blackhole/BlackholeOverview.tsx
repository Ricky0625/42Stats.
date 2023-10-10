import CardDiv from "@/components/CardDiv"
import TextBasedContent, { TextState } from "@/components/TextBasedContent"
import { Laugh, AlertTriangle, Skull, Orbit, LandPlot, ThumbsUp } from "lucide-react"
import React, { Suspense } from "react";
import { UserData } from "./blackholeData";
import Ranking from "@/components/Ranking";
import Loading from "../loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import AvatarWithHoverCard from "@/components/AvatarWithHoverCard";
import AvatarTooltip from "@/components/AvatarTooltip";
import { BlackholeContext } from "./layout";

const BlackholeStatContent = ({
  state = TextState.OK,
}: {
  state?: TextState,
}) => {

  const { data, mbhd } = React.useContext(BlackholeContext);
  const [value, setValue] = React.useState(0);

  const filterFunc = {
    "ok": (user: UserData) => user.bh_days >= mbhd,
    "warning": (user: UserData) => user.bh_days < mbhd && user.bh_days >= 0,
    "destructive": (user: UserData) => user.bh_days < 0,
  }

  React.useEffect(() => {
    const key = state === TextState.OK ? "ok" : state === TextState.WARNING ? "warning" : "destructive";
    const count = data.filter(filterFunc[key]);
    setValue(count.length)
  }, [data])

  return (
    <TextBasedContent content={value.toString()} state={state} />
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

  React.useEffect(() => {
    const key = viewState === TextState.OK ? "ok" : viewState === TextState.WARNING ? "warning" : "destructive";
    const users = data.filter(filterFunc[key]);
    setUsers(users);
  }, [data, viewState])

  return (
    <Suspense fallback={<Loading />}>
      {
        users.length === 0
          ? <div className="grid place-items-center min-h-full text-sm pt-6"><ThumbsUp />No one is in the {`${viewState === TextState.OK ? "safe" : viewState === TextState.WARNING ? "danger" : "dead"}`} zone.</div>
          : <ScrollArea className="h-[600px] lg:h-[500px]">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {users.map((user, i) => (
                <AvatarWithHoverCard key={`${i}danger`} src={user.image} name={user.login} intraName={user.login} content={<AvatarTooltip {...user} />} />
              ))}
            </div>
          </ScrollArea>
      }
    </Suspense>
  )
}

const BlackholeUsers = () => {

  const { data } = React.useContext(BlackholeContext);
  const [toppers, setToppers] = React.useState<UserData[]>([])

  React.useEffect(() => {
    const top10 = data.filter((user) => user.bh_days >= 0).sort((userA, userB) => (userA.bh_days - userB.bh_days)).slice(0, 10)
    setToppers(top10);
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
      {toppers.map((user, i) => (
        <Ranking key={`${i}topper`} {...user} />
      ))}
    </div>
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
    className: `col-span-1`
  },
  {
    title: "Danger Cadets",
    description: undefined,
    icon: <AlertTriangle size={20} />,
    content: <BlackholeStatContent state={TextState.WARNING} />,
    footer: undefined,
    state: TextState.WARNING,
    className: `col-span-1`
  },
  {
    title: "Fallen Soldiers",
    description: undefined,
    icon: <Skull size={20} />,
    content: <BlackholeStatContent state={TextState.DESTRUCTIVE} />,
    footer: undefined,
    state: TextState.DESTRUCTIVE,
    className: `col-span-1`
  },
]

const blackholeList = [
  {
    id: "ranking",
    title: ["Blackhole Timer Toppers"],
    description: ["Students who are on their journey into the Blackhole."],
    icon: <Orbit size={20} />,
    content: <BlackholeUsers />,
    footer: undefined,
    className: `col-span-2 md:col-span-1 lg:col-span-2 row-span-3 md:row-span-4 md:col-start-3`
  },
  {
    id: "viewZone",
    title: [
      "Safe Zone",
      "Danger Zone",
      "Dead Zone"
    ],
    description: [
      "Smooth sailing. Keep up the great work!",
      "Time's ticking, but hope remains for our comrades!",
      "Remembering our fallen comrades...",
    ],
    icon: <LandPlot size={20} />,
    content: <ZoneViewer />,
    footer: undefined,
    className: `col-span-2 row-span-3 lg:col-span-3 md:col-start-1 md:row-start-2`
  },
]

const BlackholeOverview = () => {

  const bhCtx = React.useContext(BlackholeContext);

  return (<div className="m-auto pt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-max gap-4">
    {statCards.map((stat, i) => (
      <a className={stat.className + `cursor-pointer group`} key={i} onClick={() => bhCtx.setViewState(stat.state)} href="#viewZone">
        <CardDiv
          title={stat.title}
          description={stat.description}
          icon={stat.icon}
          content={stat.content}
          footer={stat.footer}
        />
      </a>
    ))}
    {blackholeList.map((stat, i) => (
      <div className={stat.className} key={i} id={stat.id}>
        <CardDiv
          title={i === 0 ? stat.title[0] : stat.title[bhCtx.viewState]}
          description={i === 0 ? stat.description[0] : stat.description[bhCtx.viewState]}
          icon={stat.icon}
          content={stat.content}
          footer={stat.footer}
        />
      </div>
    ))}
  </div>)
}

export default BlackholeOverview