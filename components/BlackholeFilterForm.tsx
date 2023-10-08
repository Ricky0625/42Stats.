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
import { BlackholeContext } from "@/app/blackhole/page"

const formSchema = z.object({
  safeZoneMin: z.coerce.number().gte(10, { message: "Must be greater and equal to 10" }),
})

const BlackholeFilterForm = () => {

  const [open, setOpen] = React.useState(false)
  const bhCtx = React.useContext(BlackholeContext)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safeZoneMin: bhCtx.mbhd
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    bhCtx.setMbhd(values.safeZoneMin)
    setOpen(false)
  }

  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <p className="text-foreground/40 font-semibold text-sm hidden md:block">Batch: {bhCtx.batch.month === undefined && bhCtx.batch.year === undefined ? "All" : `${bhCtx.batch.month} ${bhCtx.batch.year}`}</p>
      <span className="text-foreground/30 font-bold hidden md:block">|</span>
      <p className="text-foreground/40 font-semibold text-sm hidden md:block">MBHD: {bhCtx.mbhd}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Adjust parameters</Button>
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BlackholeFilterForm