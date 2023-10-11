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
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import React from "react"
import { BatchData, getALlBatch } from "./BlackholeFilterForm"
import { OverviewContext } from "@/app/page"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { MilestoneContext } from "@/app/milestone/page"

const formSchema = z.object({
  login: z.string().min(1)
})

const MilestoneForm = () => {

  const [open, setOpen] = React.useState(false);
  const milestoneCtx = React.useContext(MilestoneContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: ""
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    milestoneCtx.setLogin(values.login);
    setOpen(false)
  }

  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <p className="text-foreground/40 font-semibold text-sm hidden md:block"></p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline"><Search size={16} /><span className="hidden md:block">&nbsp;Search student</span></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intra name</FormLabel>
                    <FormControl>
                      <Input placeholder="Intra name" {...field} />
                    </FormControl>
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

export default MilestoneForm