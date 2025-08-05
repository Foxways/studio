"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShieldCheck,
  LayoutDashboard,
  StickyNote,
  KeyRound,
  Wrench,
  Settings,
  UserCog,
  HeartPulse,
  ScanSearch,
  Bot,
  ShieldAlert,
  BadgeInfo,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "./ui/scroll-area"

const mainNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
  { href: "/dashboard/licenses", label: "Licenses", icon: BadgeInfo },
]

const toolLinks = [
  { href: "/dashboard/tools/password-generator", label: "Password Generator", icon: Bot },
  { href: "/dashboard/tools/password-analyzer", label: "Password Analyzer", icon: HeartPulse },
  { href: "/dashboard/tools/phishing-detector", label: "Phishing Detector", icon: ScanSearch },
  { href: "/dashboard/tools/dark-web-monitor", label: "Dark Web Monitor", icon: ShieldAlert },
]

const bottomNavLinks = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/admin", label: "Admin", icon: UserCog },
]

export default function DashboardSidebar({ isMobile = false }) {
  const pathname = usePathname()

  const NavLink = ({ href, label, icon: Icon }: (typeof mainNavLinks)[0]) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
        pathname === href && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
  
  const content = (
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="">SecurePass</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <Accordion type="single" collapsible defaultValue="tools" className="w-full">
              <AccordionItem value="tools" className="border-none">
                <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:no-underline [&[data-state=open]>svg]:rotate-180">
                   <Wrench className="h-4 w-4" />
                   Tools
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                  <nav className="grid gap-1">
                    {toolLinks.map((link) => (
                      <NavLink key={link.href} {...link} />
                    ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
          <nav className="mt-auto grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            {bottomNavLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </ScrollArea>
      </div>
    );

  if (isMobile) {
    return content;
  }

  return (
    <aside className="hidden border-r bg-card md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {content}
    </aside>
  )
}
