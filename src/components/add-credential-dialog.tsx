'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Plus, X, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCredentialStore, type Credential } from '@/stores/credential-store';
import { formatDistanceToNow } from 'date-fns';

const TAG_OPTIONS = ['work', 'personal', 'social', 'finance', 'development'];

type CustomField = {
  id: number;
  label: string;
  value: string;
};

type AddCredentialDialogProps = {
    children: React.ReactNode;
    credential?: Credential;
}

export function AddCredentialDialog({ children, credential }: AddCredentialDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { addCredential, updateCredential } = useCredentialStore();

  useEffect(() => {
    if (credential) {
      setTitle(credential.title);
      setUsername(credential.username);
      setPassword(credential.password);
      setUrl(credential.url || '');
      setTags(credential.tags || []);
      setNotes(credential.notes || '');
      setCustomFields(credential.customFields || []);
    }
  }, [credential]);

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: Date.now(), label: '', value: '' },
    ]);
  };

  const handleRemoveCustomField = (id: number) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const handleCustomFieldChange = (
    id: number,
    key: 'label' | 'value',
    value: string
  ) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleTagSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  const generatePassword = () => {
    const charSets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    const availableChars = charSets.lowercase + charSets.uppercase + charSets.numbers + charSets.symbols;
    let newPassword = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        newPassword += availableChars[randomIndex];
    }
    return newPassword;
  }

  const handleGeneratePassword = async () => {
    setIsGenerating(true);
    // Simulate a short delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPassword = generatePassword();
    setPassword(newPassword);
    toast({ title: 'Success', description: 'New password generated.' });
    setIsGenerating(false);
  };

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
    setTags([]);
    setNotes('');
    setCustomFields([]);
  }

  const handleSave = () => {
    if (!title || !username || !password) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill in all required fields.' });
      return;
    }
    
    const newCredential: Omit<Credential, 'id' | 'lastModified'> = {
        title,
        username,
        password,
        url,
        tags,
        notes,
        customFields,
    };

    if (credential) {
        updateCredential(credential.id, { ...newCredential, lastModified: formatDistanceToNow(new Date(), { addSuffix: true }) });
        toast({ title: 'Success', description: 'Credential updated.' });
    } else {
        addCredential({
            ...newCredential,
            id: Date.now().toString(),
            lastModified: 'just now',
        });
        toast({ title: 'Success', description: 'Credential saved.' });
    }
    
    resetForm();
    setOpen(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (!credential) { // Only reset if it's "Add New", not "Edit"
        resetForm();
      }
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{credential ? 'Edit Credential' : 'Add New Credential'}</DialogTitle>
          <DialogDescription>
            {credential ? 'Update the details for this credential.' : "Fill in the details for the new credential. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Google" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://google.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username / Email</Label>
            <Input id="username" placeholder="e.g. user@gmail.com" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button variant="secondary" onClick={handleGeneratePassword} disabled={isGenerating}>
                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                Generate
              </Button>
            </div>
          </div>
         
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button onClick={() => handleTagRemove(tag)} className="ml-1 rounded-full p-0.5 hover:bg-black/20">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleTagSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select tags..." />
              </SelectTrigger>
              <SelectContent>
                {TAG_OPTIONS.filter(opt => !tags.includes(opt)).map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Add any notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Custom Fields</Label>
              <Button variant="outline" size="sm" onClick={handleAddCustomField}>
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </div>
            {customFields.map((field) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="grid gap-1.5 flex-1">
                  <Label htmlFor={`cf-label-${field.id}`} className="text-xs">Label</Label>
                  <Input
                    id={`cf-label-${field.id}`}
                    placeholder="e.g. Security Question"
                    value={field.label}
                    onChange={(e) => handleCustomFieldChange(field.id, 'label', e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5 flex-1">
                   <Label htmlFor={`cf-value-${field.id}`} className="text-xs">Value</Label>
                  <Input
                    id={`cf-value-${field.id}`}
                    placeholder="e.g. First pet's name?"
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(field.id, 'value', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleRemoveCustomField(field.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
