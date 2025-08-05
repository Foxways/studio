'use client';

import { useState, useMemo } from 'react';
import { MoreHorizontal, Share2, Trash2, Filter } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PageHeader } from '@/components/page-header';
import { GlassCard } from '@/components/glass-card';
import { AddCredentialDialog } from '@/components/add-credential-dialog';
import { useRouter } from 'next/navigation';
import { useCredentialStore } from '@/stores/credential-store';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const { credentials, deleteCredential, deleteCredentials } =
    useCredentialStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRowClick = (credId: string) => {
    router.push(`/dashboard/credentials/${credId}`);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelected(filteredCredentials.map((c) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((sId) => sId !== id));
    }
  };
  
  const handleDeleteMarked = () => {
    deleteCredentials(selected);
    toast({ title: 'Success', description: `${selected.length} credentials deleted.` });
    setSelected([]);
  };

  const handleDeleteOne = (e: React.MouseEvent, credId: string) => {
    e.stopPropagation();
    deleteCredential(credId);
    toast({ title: 'Success', description: 'Credential deleted.' });
  }
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    credentials.forEach(cred => {
      cred.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [credentials]);

  const filteredCredentials = useMemo(() => {
    if (!tagFilter) {
      return credentials;
    }
    return credentials.filter(cred => cred.tags.includes(tagFilter));
  }, [credentials, tagFilter]);

  return (
    <>
      <PageHeader
        title="Welcome to your Vault"
        description="Securely manage your passwords and sensitive information."
      >
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> 
                {tagFilter ? `Filter: ${tagFilter}` : 'Filter by tag'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={tagFilter === tag}
                  onSelect={() => setTagFilter(tag === tagFilter ? null : tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
              {tagFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTagFilter(null)}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" disabled={selected.length === 0}>
            <Share2 className="mr-2 h-4 w-4" /> Share Marked
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={selected.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Marked
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {selected.length} selected credentials.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMarked}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AddCredentialDialog>
            <Button>Add New</Button>
          </AddCredentialDialog>
        </div>
      </PageHeader>

      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    filteredCredentials.length > 0 && selected.length === filteredCredentials.length
                      ? true
                      : selected.length > 0 && selected.length < filteredCredentials.length
                      ? 'indeterminate'
                      : false
                  }
                  onCheckedChange={handleSelectAll}
                />
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
            {filteredCredentials.map((cred) => (
              <TableRow
                key={cred.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(cred.id)}
              >
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  className="w-[40px]"
                >
                  <Checkbox
                    checked={selected.includes(cred.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(cred.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{cred.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {cred.username}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {cred.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(cred.lastModified), { addSuffix: true })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <AddCredentialDialog credential={cred}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
                       </AddCredentialDialog>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this credential.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleDeleteOne(e, cred.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCredentials.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
            <p>No credentials found for the selected filter.</p>
            </div>
        )}
      </GlassCard>
    </>
  );
}
