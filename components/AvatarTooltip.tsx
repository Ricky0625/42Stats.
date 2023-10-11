import { StudentData } from "@/app/blackhole/blackholeData"
import { Badge, BadgeDollarSign, GaugeCircle, Hash, MonitorDot, Shield, User } from "lucide-react"
import React from "react"

export const MONTH = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC",
]

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

const AvatarTooltip = (user: StudentData) => {
  return (
    <div className="flex flex-col space-y-1">
      <AvatarTooltipItem icon={<User size={14} />} value={user.full_name} />
      <AvatarTooltipItem icon={<Badge size={14} />} value={`${MONTH[user.cp_batch_month - 1]} ${user.cp_batch_year}`} />
      <AvatarTooltipItem icon={<BadgeDollarSign size={14} />} value={`${user.wallet}₳`} />
      <AvatarTooltipItem icon={<Hash size={14} />} value={`${user.eval_pts} EP`} />
      <AvatarTooltipItem icon={<GaugeCircle size={14} />} value={`lvl. ${user.cp_level}`} />
    </div>
  )
}

export default AvatarTooltip