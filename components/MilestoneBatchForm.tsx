"use client"

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
import { OverviewContext } from "@/app/page"
import { Search, Users2 } from "lucide-react"
import { Input } from "./ui/input"
import { MilestoneContext } from "@/app/milestone/page"
import { MONTH } from "./AvatarTooltip"

const formSchema = z.object({
  batchA: z.string(),
  batchB: z.string()
})

const MilestoneBatchForm = () => {

  const [open, setOpen] = React.useState(false);
  const [batchLabels, setBatchLabels] = React.useState<BatchData[]>([]);
  const milestoneCtx = React.useContext(MilestoneContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchA: "",
      batchB: ""
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const batchAInfo = values.batchA.split(" ");
    const batchBInfo = values.batchB.split(" ");
    milestoneCtx.setBatches([
      {
        year: Number(batchAInfo[1]),
        month: MONTH.indexOf(batchAInfo[0]) + 1
      },
      {
        year: Number(batchBInfo[1]),
        month: MONTH.indexOf(batchBInfo[0]) + 1
      },
    ])
    setOpen(false);
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
      <p className="text-foreground/40 font-semibold text-sm hidden md:block"></p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><Users2 size={16} /><span className="hidden md:block">&nbsp;Select Batch</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="batchA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch A</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch to filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" overflow-y-scroll max-h-56">
                        {batchLabels.map((batch, i) => (
                          <SelectItem key={`${i}${batch.month}`} value={`${MONTH[batch.month - 1]} ${batch.year}`}>{`${MONTH[batch.month - 1]} ${batch.year}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch B</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch to filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" overflow-y-scroll max-h-56">
                        {batchLabels.map((batch, i) => (
                          <SelectItem key={`${i}${batch.month}`} value={`${MONTH[batch.month - 1]} ${batch.year}`}>{`${MONTH[batch.month - 1]} ${batch.year}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Get</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MilestoneBatchForm