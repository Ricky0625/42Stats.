import { Mail } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.")
})

const NotifyEmail = () => {

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    return toast({
      title: "Scheduled: Blackhole Alert",
      description: `Sending an alert to ${values.email}...`,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <Mail size={16} /><span className="hidden md:block">&nbsp;Notify Me</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designated Recipient</FormLabel>
                  <FormControl>
                    <Input placeholder="abc123@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="!mt-2"
            >
              Send
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default NotifyEmail