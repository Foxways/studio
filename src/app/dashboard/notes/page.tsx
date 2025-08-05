import { PlusCircle, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { notes } from "@/lib/data"
import { GlassCard } from "@/components/glass-card"

export default function NotesPage() {
  return (
    <>
      <PageHeader
        title="Secure Notes"
        description="Organize your thoughts and sensitive information securely."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => (
          <GlassCard key={note.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="mb-2">{note.category}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost" className="-mt-2 -mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
            <p className="text-sm text-muted-foreground flex-grow">{note.excerpt}</p>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">{note.lastModified}</p>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
