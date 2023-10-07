import AvatarPic from "./Avatar"
import AvatarWithHoverCard from "./AvatarWithHoverCard"

const Ranking = ({ }: {}) => {
  return (
    <div className="grid-cols-1 grid-rows-1 p-4 py-2 w-full border border-input rounded space-between">
      <div className="flex flex-row space-between items-center">
        <AvatarWithHoverCard name="shadcn" src="https://github.com/shadcn.png" content={<></>} col={false} />
        <p className="text-2xl right-0 flex-1 text-right font-black animate-pulse">40 <span className="text-sm font-thin">days</span></p>
      </div>
    </div>
  )
}

export default Ranking