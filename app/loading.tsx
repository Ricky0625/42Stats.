import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="container grid place-items-center min-h-screen">
      <div className="flex flex-col items-center space-y-6">
        <Loader2 size={128} strokeWidth={3} className="animate-spin"/>
        <p className="font-bold text-lg text-foreground">Just count to 10. Trust me....</p>
      </div>
    </div>
  )
}

export default Loading