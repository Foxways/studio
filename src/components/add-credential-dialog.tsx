'use client';

import { useState } from 'react';
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
import { generatePasswordAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const TAG_OPTIONS = ['work', 'personal', 'social', 'finance', 'development'];

type CustomField = {
  id: number;
  label: string;
  value: string;
};

export function AddCredentialDialog() {
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

  const handleGeneratePassword = async () => {
    setIsGenerating(true);
    const response = await generatePasswordAction({
      length: 16,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
      complexityLevel: 'high',
    });
    if (response.success && response.data) {
      setPassword(response.data.password);
      toast({ title: 'Success', description: 'New password generated.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate password.',
      });
    }
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
    // In a real app, you would handle form submission here
    console.log({ title, username, password, url, tags, notes, customFields });
    resetForm();
    setOpen(false);
    toast({ title: 'Success', description: 'Credential saved.' });
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
          <DialogDescription>
            Fill in the details for the new credential. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Google" value={title} onChange={(e) => setTitle(e.target.value)} />
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
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="https://google.com" value={url} onChange={(e) => setUrl(e.target.value)} />
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
