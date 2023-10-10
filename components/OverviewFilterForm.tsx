import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import React from "react"
import { BatchData, getALlBatch } from "./BlackholeFilterForm"
import { MONTH } from "./AvatarTooltip"
import { OverviewContext } from "@/app/page"
import { Wrench } from "lucide-react"

const formSchema = z.object({
  batch: z.string()
})

const OverviewFilterForm = () => {

  const [open, setOpen] = React.useState(false)
  const [batchLabels, setBatchLabels] = React.useState<BatchData[]>([])
  const ovCtx = React.useContext(OverviewContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch: "All"
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.batch === "All")
      ovCtx.setBatch({
        year: 0,
        month: 0
      })
    else {
      const batchInfo = values.batch.split(" ")
      ovCtx.setBatch({
        year: Number(batchInfo[1]),
        month: MONTH.indexOf(batchInfo[0]) + 1
      })
    }
    setOpen(false)
  }

  React.useEffect(() => {
    const fetchAllBatch = async () => {
      return await getALlBatch()
    }

    fetchAllBatch().then((res) => {
      setBatchLabels(res)
    })
  }, [])

  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <p className="text-foreground/40 font-semibold text-sm hidden md:block">Batch: {ovCtx.batch.month === 0 && ovCtx.batch.year === 0 ? "All" : `${MONTH[ovCtx.batch.month - 1]} ${ovCtx.batch.year}`}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><Wrench size={16}/><span className="">&nbsp;Adjust parameters</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch to filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" overflow-y-scroll max-h-56">
                        <SelectItem value={"All"}>All</SelectItem>
                        {batchLabels.map((batch, i) => (
                          <SelectItem key={`${i}${batch.month}`} value={`${MONTH[batch.month - 1]} ${batch.year}`}>{`${MONTH[batch.month - 1]} ${batch.year}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OverviewFilterForm