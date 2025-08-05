import { PlusCircle, MoreHorizontal } from "lucide-react"

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
import { PageHeader } from "@/components/page-header"
import { licenses } from "@/lib/data"
import { GlassCard } from "@/components/glass-card"

export default function LicensesPage() {
  return (
    <>
      <PageHeader
        title="License Keys"
        description="Securely store and manage your software licenses and product keys."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add License
        </Button>
      </PageHeader>
      
      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Key</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-medium">{license.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{license.productKey}</TableCell>
                <TableCell className="text-muted-foreground">{license.purchaseDate}</TableCell>
                <TableCell className="text-muted-foreground">{license.expiryDate}</TableCell>
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
                      <DropdownMenuItem>Copy Key</DropdownMenuItem>
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
