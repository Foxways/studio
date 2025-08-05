import { Users, KeyRound, ShieldAlert } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import { Button } from "@/components/ui/button"
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
import { adminUsers, chartData } from "@/lib/data"
import { GlassCard } from "@/components/glass-card"

export default function AdminDashboard() {
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
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Credentials Stored</h3>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">25,841</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
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

      <div className="grid gap-8 lg:grid-cols-5">
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
            <h3 className="text-lg font-medium mb-4">Recent Users</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell><Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </GlassCard>
      </div>
    </>
  )
}
