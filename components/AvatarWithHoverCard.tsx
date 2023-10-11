import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import AvatarPic from "./Avatar"
import Link from "next/link"

const AvatarWithHoverCard = ({
  src,
  name,
  intraName,
  content,
  col = true,
}: {
  src: string | undefined,
  name: string,
  intraName: string,
  content: React.ReactNode,
  col?: boolean
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="hover:cursor-pointer" href={`https://profile.intra.42.fr/users/${intraName}`} target="_blank">
        <div className={`flex ${col ? 'flex-col space-y-1' : 'flex-row space-x-1'} items-center`}>
          <AvatarPic src={src} name={name} />
          <span className="text-sm font-medium">{name}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        {content}
      </HoverCardContent>
    </HoverCard>
  )
}

export default AvatarWithHoverCard