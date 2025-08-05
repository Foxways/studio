
'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { Users, KeyRound, ShieldAlert, MoreVertical, Trash2 } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { chartData } from "@/lib/data"
import { GlassCard } from "@/components/glass-card"
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ActionType = 'reset' | 'delete' | null;

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { users, toggleUserStatus, deleteUser, resetPassword } = useUserStore();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);


  useEffect(() => {
    if (user?.role !== 'Admin') {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (user?.role !== 'Admin') {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Access Denied. Redirecting...</p>
        </div>
    );
  }

  const handleStatusChange = (userId: string, active: boolean) => {
    toggleUserStatus(userId);
    toast({
        title: "Success",
        description: `User account has been ${active ? 'activated' : 'deactivated'}.`
    });
  };

  const handleActionConfirm = () => {
    if (!selectedUser || !actionType) return;
    if (actionType === 'reset') {
      resetPassword(selectedUser);
      toast({
        title: 'Success',
        description: `Password has been reset. The user will be required to set a new password on their next login.`,
      });
    } else if (actionType === 'delete') {
      deleteUser(selectedUser);
      toast({
        variant: 'destructive',
        title: 'Success',
        description: 'User has been permanently deleted.',
      });
    }
    setSelectedUser(null);
    setActionType(null);
  };
  
  const openDialog = (userId: string, type: ActionType) => {
    setSelectedUser(userId);
    setActionType(type);
  };

  const getDialogContent = () => {
    if (!actionType) return null;
    
    const isReset = actionType === 'reset';
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    {isReset
                        ? "This will reset the user's password and require them to create a new one on their next login. This action cannot be undone."
                        : "This will permanently delete the user's account. This action cannot be undone."
                    }
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setActionType(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleActionConfirm}
                    className={cn(!isReset && buttonVariants({ variant: "destructive" }))}
                >
                  {isReset ? "Reset Password" : "Delete User"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
  };


  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Manage users, roles, and application settings."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <GlassCard>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Users</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Active Users</h3>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{users.filter(u => u.active).length}</div>
          <p className="text-xs text-muted-foreground">All active users</p>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Security Alerts</h3>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">12</div>
          <p className="text-xs text-muted-foreground">Needs attention</p>
        </GlassCard>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5">
        <GlassCard className="lg:col-span-3">
          <h3 className="text-lg font-medium mb-4">User Sign-ups</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                 <Tooltip
                  cursor={{ fill: "hsl(var(--primary) / 0.1)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background) / 0.8)",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Bar dataKey="desktop" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">User Management</h3>
             <AlertDialog open={!!actionType} onOpenChange={(open) => !open && setActionType(null)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>
                                <div className="font-medium">{u.name}</div>
                                <div className="text-sm text-muted-foreground">{u.email}</div>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-2">
                                <Switch
                                    checked={u.active}
                                    onCheckedChange={() => handleStatusChange(u.id, !u.active)}
                                    disabled={u.email === user?.email}
                                    aria-label={`Toggle status for ${u.name}`}
                                />
                                <span className={cn("text-xs", u.active ? "text-green-400" : "text-red-400")}>
                                    {u.active ? 'Active' : 'Inactive'}
                                </span>
                               </div>
                            </TableCell>
                            <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                        disabled={u.email === user?.email}
                                        >
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={() => openDialog(u.id, 'reset')}>
                                                <KeyRound className="mr-2 h-4 w-4" />
                                                Reset Password
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-red-500" onSelect={() => openDialog(u.id, 'delete')}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {getDialogContent()}
            </AlertDialog>
        </GlassCard>
      </div>
    </>
  )
}
