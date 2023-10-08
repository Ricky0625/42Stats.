import { Badge, BadgeDollarSign, GaugeCircle, Hash, MonitorDot, Shield, User } from "lucide-react"
import React from "react"

export interface UserData {
  fullname: string
  batch: string
  evalPoints: number
  alterianCoin: number
  location: string | null
  coalition: string
  level: number
}

const AvatarTooltipItem = ({
  icon,
  value,
  link,
}: {
  icon: React.ReactNode,
  value: string | number | null
  link?: string
}) => {
  return (
    <span className="inline-flex flex-row space-x-1 text-sm items-center">
      {icon}
      <span className="font-medium">{value}</span>
    </span>
  )
}

const AvatarTooltip = (user: UserData) => {
  return (
    <div className="flex flex-col space-y-1">
      <AvatarTooltipItem icon={<User size={14}/>} value={user.fullname}/>
      <AvatarTooltipItem icon={<Badge size={14}/>} value={user.batch}/>
      <AvatarTooltipItem icon={<Shield size={14}/>} value={user.coalition}/>
      <AvatarTooltipItem icon={<MonitorDot size={14}/>} value={user.location}/>
      <AvatarTooltipItem icon={<BadgeDollarSign size={14}/>} value={`${user.alterianCoin}₳`}/>
      <AvatarTooltipItem icon={<Hash size={14}/>} value={`${user.evalPoints} EP`}/>
      <AvatarTooltipItem icon={<GaugeCircle size={14}/>} value={`lvl. ${user.level}`}/>
    </div>
  )
}

export default AvatarTooltip