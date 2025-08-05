'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useLicenseStore, type License } from '@/stores/license-store';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

type AddLicenseDialogProps = {
  children: React.ReactNode;
  license?: License;
};

export function AddLicenseDialog({ children, license }: AddLicenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [productKey, setProductKey] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const { addLicense, updateLicense } = useLicenseStore();

  useEffect(() => {
    if (open && license) {
      setName(license.name);
      setProductKey(license.productKey);
      if (license.purchaseDate) {
        setPurchaseDate(new Date(license.purchaseDate));
      } else {
        setPurchaseDate(undefined);
      }
      if (license.expiryDate) {
        setExpiryDate(new Date(license.expiryDate));
      } else {
        setExpiryDate(undefined);
      }
    } else if (!open) {
        resetForm();
    }
  }, [license, open]);

  const resetForm = () => {
    setName('');
    setProductKey('');
    setPurchaseDate(undefined);
    setExpiryDate(undefined);
  };

  const handleSave = () => {
    if (!name || !productKey || !purchaseDate || !expiryDate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const newLicense = {
      name,
      productKey,
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };

    if (license) {
      updateLicense(license.id, newLicense);
      toast({ title: 'Success', description: 'License updated.' });
    } else {
      addLicense(newLicense);
      toast({ title: 'Success', description: 'License saved.' });
    }

    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{license ? 'Edit License' : 'Add New License'}</DialogTitle>
          <DialogDescription>
            {license
              ? 'Update the details for this license.'
              : "Fill in the details for the new license. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Adobe Creative Cloud"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productKey">Product Key</Label>
            <Input
              id="productKey"
              placeholder="Enter product key"
              value={productKey}
              onChange={(e) => setProductKey(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !purchaseDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !expiryDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
