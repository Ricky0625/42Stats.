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
import { KeyRound } from "lucide-react"
import { MilestoneContext } from "@/app/milestone/page"

const formSchema = z.object({
  mode: z.string().min(1)
})

const MilestoneModeForm = () => {

  const mode = ["Student", "Batch"]
  const [open, setOpen] = React.useState(false);
  const milestoneCtx = React.useContext(MilestoneContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: mode[0]
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    milestoneCtx.setMode(values.mode);
    setOpen(false)
  }

  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <p className="text-foreground/40 font-semibold text-sm hidden md:block"></p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><KeyRound size={16} /><span className="hidden md:block">&nbsp;Switch Mode</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monitor mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch to filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=" overflow-y-scroll max-h-56">
                        {mode.map((type, i) => (
                          <SelectItem key={`${i}${type}`} value={`${type}`}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">OK</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MilestoneModeForm