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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import React from "react"
import { MONTH } from "./AvatarTooltip"
import { BlackholeContext } from "@/app/blackhole/layout"
import { Wrench } from "lucide-react"

const formSchema = z.object({
  safeZoneMin: z.coerce.number().gte(10, { message: "Must be greater and equal to 10" }),
  batch: z.string()
})

export type BatchData = {
  year: number,
  month: number
}

export const getALlBatch = async () => {
  const res = await fetch(`/api/batch`);
  const resJson = await res.json();
  return resJson;
}

const BlackholeFilterForm = () => {

  const [open, setOpen] = React.useState(false)
  const [batchLabels, setBatchLabels] = React.useState<BatchData[]>([])
  const bhCtx = React.useContext(BlackholeContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safeZoneMin: bhCtx.mbhd,
      batch: "All"
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    bhCtx.setMbhd(values.safeZoneMin)
    if (values.batch === "All")
      bhCtx.setBatch({
        year: 0,
        month: 0
      })
    else {
      const batchInfo = values.batch.split(" ")
      bhCtx.setBatch({
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
      <p className="text-foreground/40 font-semibold text-sm hidden md:block">Batch: {bhCtx.batch.month === 0 && bhCtx.batch.year === 0 ? "All" : `${MONTH[bhCtx.batch.month - 1]} ${bhCtx.batch.year}`}</p>
      <span className="text-foreground/30 font-bold hidden md:block">|</span>
      <p className="text-foreground/40 font-semibold text-sm hidden md:block">MBHD: {bhCtx.mbhd}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><Wrench size={16}/><span className="hidden md:block">&nbsp;Adjust parameters</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="safeZoneMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum blackhole day for safe zone (MBHD)</FormLabel>
                    <FormControl>
                      <Input placeholder="Example: 60" {...field} />
                    </FormControl>
                    <FormDescription>
                      Any value less than MBHD will consider as <span className="text-destructive-foreground font-bold">Danger zone</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default BlackholeFilterForm