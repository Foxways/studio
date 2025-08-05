
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
  Bot,
  Inbox,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "./ui/scroll-area"
import { useAuthStore } from "@/stores/auth-store"
import { useShareStore } from "@/stores/share-store"

const mainNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
  { href: "/dashboard/licenses", label: "Licenses", icon: KeyRound },
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox, isInbox: true },
  { href: "/dashboard/outbox", label: "Outbox", icon: Send },
]

const toolLinks = [
  { href: "/dashboard/tools/password-generator", label: "Password Generator", icon: Bot },
]

const bottomNavLinks = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const adminLink = { href: "/dashboard/admin", label: "Admin", icon: UserCog };


export default function DashboardSidebar({ isMobile = false }) {
  const pathname = usePathname()
  const { user } = useAuthStore();
  const { getInbox } = useShareStore();

  const inboxCount = user ? getInbox(user.email).length : 0;

  const NavLink = ({ href, label, icon: Icon, isInbox = false }: (typeof mainNavLinks)[0]) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
        pathname === href && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {isInbox && inboxCount > 0 && (
        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {inboxCount}
        </span>
      )}
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
          <div className="flex flex-col h-full py-4">
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
               {user?.role === 'Admin' && (
                <NavLink key={adminLink.href} {...adminLink} />
              )}
            </nav>
          </div>
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
