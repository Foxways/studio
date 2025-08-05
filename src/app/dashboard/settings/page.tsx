
'use client';

import { useRef, useState } from 'react';
import { Sun, Moon, Download, Upload, User, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { GlassCard } from "@/components/glass-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from "@/hooks/use-toast";
import { useCredentialStore } from '@/stores/credential-store';
import { useNoteStore } from '@/stores/note-store';
import { useLicenseStore } from '@/stores/license-store';


export default function SettingsPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImportAlertOpen, setIsImportAlertOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Get store data and actions
  const { credentials, replaceCredentials } = useCredentialStore();
  const { notes, replaceNotes } = useNoteStore();
  const { licenses, replaceLicenses } = useLicenseStore();

  const handleExport = () => {
    const vaultData = {
      credentials,
      notes,
      licenses,
    };
    const jsonString = JSON.stringify(vaultData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'securepass-vault.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: 'Your vault has been exported successfully.',
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setIsImportAlertOpen(true);
      // Reset the input value to allow re-selecting the same file
      event.target.value = '';
    }
  };

  const handleImportConfirm = () => {
    if (!pendingFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File is not valid text.');
        }
        const data = JSON.parse(text);

        // Basic validation
        if (data && Array.isArray(data.credentials) && Array.isArray(data.notes) && Array.isArray(data.licenses)) {
          replaceCredentials(data.credentials);
          replaceNotes(data.notes);
          replaceLicenses(data.licenses);
          toast({
            title: 'Import Successful',
            description: 'Your vault has been restored from the backup.',
          });
        } else {
          throw new Error('Invalid backup file structure.');
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      } finally {
        setPendingFile(null);
        setIsImportAlertOpen(false);
      }
    };
    reader.readAsText(pendingFile);
  };
  
  const handleImportCancel = () => {
    setPendingFile(null);
    setIsImportAlertOpen(false);
  }

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
                        <p className="text-sm text-muted-foreground">Export your vault to a JSON file.</p>
                    </div>
                    <Button variant="secondary" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Import Data</h4>
                        <p className="text-sm text-muted-foreground">Import data from a JSON backup file.</p>
                    </div>
                    <Button variant="secondary" onClick={handleImportClick}>
                         <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="application/json"
                      className="hidden"
                    />
                </div>
            </div>
        </GlassCard>
      </div>

       <AlertDialog open={isImportAlertOpen} onOpenChange={setIsImportAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" />
                Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Importing a backup will overwrite all
              of your current vault data, including credentials, notes, and licenses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleImportCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              Continue with Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
