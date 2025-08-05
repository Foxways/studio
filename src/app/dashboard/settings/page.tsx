import { Sun, Moon, Download, Upload, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { GlassCard } from "@/components/glass-card"

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Customize the app's appearance and manage your data."
      />
      <div className="grid gap-8 max-w-2xl">
         <GlassCard>
            <h3 className="text-lg font-medium text-white mb-4">Account</h3>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-white">Profile</h4>
                    <p className="text-sm text-muted-foreground">View and edit your personal information.</p>
                </div>
                 <Button variant="secondary" asChild>
                    <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        Go to Profile
                    </Link>
                </Button>
            </div>
        </GlassCard>

        <GlassCard>
            <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Theme</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Sun className="h-5 w-5" />
                    </Button>
                     <Button variant="secondary" size="icon">
                        <Moon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
             <p className="text-sm text-muted-foreground mt-2">Currently in Dark Mode. Light mode coming soon!</p>
        </GlassCard>

        <GlassCard>
            <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Export Data</h4>
                        <p className="text-sm text-muted-foreground">Export your vault to a CSV or JSON file.</p>
                    </div>
                    <Button variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Import Data</h4>
                        <p className="text-sm text-muted-foreground">Import data from another password manager.</p>
                    </div>
                    <Button variant="secondary">
                         <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                </div>
            </div>
        </GlassCard>
      </div>
    </>
  )
}
