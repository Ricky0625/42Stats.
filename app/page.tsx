import CardDiv from "@/components/CardDiv"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

// also known as Overview
export default function Home() {
  return (
    <div className="container relative pt-6">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0">Overview</h2>
      <div className="m-auto pt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <CardDiv title="Average level" />
        <CardDiv title="Average level" />
        <CardDiv title="Average level" />
        <CardDiv title="Average level" />
        <CardDiv title="Average level" />
        <CardDiv title="Average level" />
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command> */}
      </div>
    </div>
  )
}
