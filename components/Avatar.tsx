import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AvatarPic = ({
  src,
  name
}: {
  src: string,
  name: string,
}) => {
  return (
    <Avatar>
      <AvatarImage src={src} alt={`@${name}`}/>
      <AvatarFallback>{name.toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default AvatarPic;
