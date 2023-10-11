import MilestoneForm from "@/components/MilestoneForm"
import { Button } from "@/components/ui/button"
import { IterationCcw } from "lucide-react"

export default function MileStone() {
  return (
    <div className="container relative pt-6 max-h-screen">
      <div className="flex w-full flex-row justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Milestone Monitor</h2>
        <MilestoneForm />
      </div>
      <div className="">
      </div>
    </div>
  )
}