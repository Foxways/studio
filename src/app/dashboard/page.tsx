import { PlusCircle, MoreHorizontal, Share2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader } from "@/components/page-header"
import { credentials } from "@/lib/data"
import { GlassCard } from "@/components/glass-card"

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Welcome to your Vault"
        description="Securely manage your passwords and sensitive information."
      >
        <div className="flex items-center gap-2">
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share Marked</Button>
            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Marked</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
        </div>
      </PageHeader>
      
      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.map((cred) => (
              <TableRow key={cred.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{cred.title}</TableCell>
                <TableCell className="text-muted-foreground">{cred.username}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                  {cred.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{cred.lastModified}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </>
  )
}
