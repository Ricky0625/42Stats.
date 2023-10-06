import { Ghost, Github, SunMoon } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./ui/toggle-mode"

const routes = [
  {
    href: "/",
    label: "Test",
  },
  {
    href: "/",
    label: "Test2"
  },
  {
    href: "/",
    label: "Test3"
  }
]

const Header = () => {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">42Stats.</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route, i) => (
              <Link key={i} href={route.href} className="hover:text-foreground/80 text-foreground/60 transition-colors">
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon">
              <Link href={`https://github.com/Ricky0625/peer-defense-hackathon`} target="_blank">
                <Github className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header