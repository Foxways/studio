import type { ChartConfig } from "@/components/ui/chart"

export const credentials = [
  {
    id: "1",
    title: "Google Account",
    username: "user@gmail.com",
    tags: ["work", "email"],
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    title: "Facebook",
    username: "user.name",
    tags: ["social"],
    lastModified: "1 day ago",
  },
  {
    id: "3",
    title: "GitHub",
    username: "username",
    tags: ["work", "development"],
    lastModified: "3 days ago",
  },
   {
    id: "4",
    title: "Twitter / X",
    username: "@username",
    tags: ["social"],
    lastModified: "5 days ago",
  },
  {
    id: "5",
    title: "Figma",
    username: "designer@example.com",
    tags: ["design", "work"],
    lastModified: "1 week ago",
  },
]

export const notes = [
    {
        id: "n1",
        title: "Project Phoenix Ideas",
        category: "Work",
        excerpt: "Initial brainstorming for the new project architecture...",
        lastModified: "4 hours ago",
    },
    {
        id: "n2",
        title: "Grocery List",
        category: "Personal",
        excerpt: "Milk, bread, cheese, and coffee beans.",
        lastModified: "Yesterday",
    },
    {
        id: "n3",
        title: "API Keys",
        category: "Development",
        excerpt: "Stripe: pk_test_... | SendGrid: SG...",
        lastModified: "2 days ago",
    },
    {
        id: "n4",
        title: "Meeting Notes 2024-07-20",
        category: "Work",
        excerpt: "Q3 planning session. Key takeaways: focus on user retention...",
        lastModified: "4 days ago",
    }
]

export const licenses = [
    {
        id: "l1",
        name: "Adobe Creative Cloud",
        productKey: "ABCD-1234-EFGH-5678",
        purchaseDate: "2023-08-15",
        expiryDate: "2024-08-15",
    },
    {
        id: "l2",
        name: "Microsoft Office 365",
        productKey: "XYZW-9876-QRST-5432",
        purchaseDate: "2023-09-01",
        expiryDate: "2024-09-01",
    },
    {
        id: "l3",
        name: "JetBrains All Products Pack",
        productKey: "ASDF-GHJK-LZXC-VBNM",
        purchaseDate: "2024-01-10",
        expiryDate: "2025-01-10",
    },
]

export const adminUsers = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    lastSeen: "2 hours ago",
  },
  {
    id: "u2",
    name: "Bob Williams",
    email: "bob@example.com",
    role: "User",
    lastSeen: "1 day ago",
  },
  {
    id: "u3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "User",
    lastSeen: "3 days ago",
  },
    {
    id: "u4",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "User",
    lastSeen: "5 days ago",
  }
]

export const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
