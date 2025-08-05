'use client';

import Link from 'next/link';
import { Menu, Search, Settings, User, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSearchStore } from '@/stores/search-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/50 px-4 backdrop-blur-md md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <DashboardSidebar isMobile />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex w-full items-center gap-4">
        <form className="ml-auto flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vault..."
              className="pl-8 w-full sm:w-[300px] md:w-[200px] lg:w-[300px] bg-card/80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src={`https://placehold.co/40x40.png?text=${userInitial}`}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
