import { fakeUser } from "@/app/blackhole/page"
import AvatarPic from "./Avatar"
import AvatarTooltip from "./AvatarTooltip"
import AvatarWithHoverCard from "./AvatarWithHoverCard"

const Ranking = ({
  login,
  bhDay
}: {
  login: string,
  bhDay: number
}) => {
  return (
    <div className="grid-cols-1 grid-rows-1 p-4 py-2 w-full border border-input rounded space-between">
      <div className="flex flex-row justify-between items-center">
        <AvatarWithHoverCard name={login} intraName={login} src="https://github.com/shadcn.png" content={<AvatarTooltip {...fakeUser}/>} col={false} />
        <div className="flex flex-row font-black text-2xl">
          <span>{bhDay}</span>&nbsp;
          <span className="font-thin text-xs bottom-1 hidden lg:block">days</span>
          <span className="font-thin text-xs bottom-1 block lg:hidden">d</span>
        </div>
      </div>
    </div>
  )
}

export default Ranking