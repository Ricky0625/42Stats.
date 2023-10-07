import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import AvatarPic from "./Avatar"

const AvatarWithHoverCard = ({
    src,
    name,
    content,
    col = true,
}: {
    src: string,
    name: string,
    content: React.ReactNode,
    col?: boolean
}) => {
    return (
        <HoverCard>
            <HoverCardTrigger className="hover:cursor-pointer">
                <div className={`flex ${col ? 'flex-col space-y-1' : 'flex-row space-x-1'} items-center`}>
                    <AvatarPic src={src} name={name}/>
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