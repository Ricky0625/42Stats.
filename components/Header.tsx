"use client"

import { Github, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { ModeToggle } from "./ui/toggle-mode"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import CommandBox from "./CommandBox"

const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/test",
    label: "Dummy"
  },
  {
    href: "/yolo",
    label: "Dummy"
  }
]

const Logo = () => {
  return (
    <Link href="/" className="mr-6 flex items-center space-x-2">
      <span className="font-bold">42Stats.</span>
    </Link>
  )
}

const MainNav = ({
  pathname
}: {
  pathname: string
}) => {
  return (
    <div className="mr-4 hidden md:flex">
      <Logo />
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map((route, i) => (
          <Link key={i} href={route.href} className={`hover:text-foreground/80 text-foreground/60 transition-colors ${pathname === route.href && `text-primary font-semibold`}`}>
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

const IconsNav = () => {
  return (
    <nav className="flex items-center">
      <Button variant="ghost" size="icon">
        <Link href={`https://github.com/Ricky0625/peer-defense-hackathon`} target="_blank">
          <Github className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all select-none" />
        </Link>
      </Button>
      <ModeToggle />
    </nav>
  )
}

const BurgerNav = ({
  pathname
}: {
  pathname: string
}) => {
  return (
    <div className="md:hidden flex flex-row space-x-4">
      <Sheet>
        <SheetTrigger><Menu size={16} strokeWidth={2} /></SheetTrigger>
        <SheetContent side={"left"}>
          <div className="flex flex-col space-y-4">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">42Stats.</span>
            </Link>
            {routes.map((route, i) => (
              <Link key={i} href={route.href} className={`font-medium hover:text-foreground/80 text-foreground/60 ${pathname === route.href && `text-primary font-semibold`}`}>
                {route.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Logo />
    </div>
  )
}

const Header = () => {

  const pathname = usePathname()

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav pathname={pathname} />
        <BurgerNav pathname={pathname} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none pl-6">
            <CommandBox />
          </div>
          <IconsNav />
        </div>
      </div>
    </header>
  )
}

export default Header