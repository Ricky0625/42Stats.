import { StudentData } from "@/app/blackhole/blackholeData"
import AvatarTooltip from "./AvatarTooltip"
import AvatarWithHoverCard from "./AvatarWithHoverCard"

const Ranking = (user: StudentData) => {
  return (
    <div className="grid-cols-1 grid-rows-1 p-4 md:p-3 py-2 md:py-1.5 w-full border border-input rounded space-between">
      <div className="flex flex-row justify-between items-center">
        <AvatarWithHoverCard name={user.login} intraName={user.login} src={user.image} content={<AvatarTooltip {...user} />} col={false} />
        <div className="flex flex-row font-black text-2xl md:text-xl">
          <span>{user.bh_days}</span>&nbsp;
          <span className="font-thin text-xs bottom-1 hidden lg:block">days</span>
          <span className="font-thin text-xs bottom-1 block lg:hidden">d</span>
        </div>
      </div>
    </div>
  )
}

export default Ranking