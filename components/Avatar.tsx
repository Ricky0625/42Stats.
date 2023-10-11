import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AvatarPic = ({
  src,
  name
}: {
  src?: string,
  name?: string,
}) => {
  return (
    <Avatar>
      <AvatarImage src={src} alt={`@${name}`} className=" object-cover"/>
      {name !== undefined && <AvatarFallback>{name.slice(0,2).toUpperCase()}</AvatarFallback>}
    </Avatar>
  )
}

export default AvatarPic;
