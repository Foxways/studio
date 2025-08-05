import type { ChartConfig } from "@/components/ui/chart"

export const users = [
    {
        email: "user@example.com",
        password: "password123",
    },
    {
        email: "admin@example.com",
        password: "adminpassword"
    }
]

export const credentials = [
  {
    id: "1",
    title: "Google Account",
    username: "user@gmail.com",
    password: "password123",
    tags: ["work", "email"],
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    title: "Facebook",
    username: "user.name",
    password: "password123",
    tags: ["social"],
    lastModified: "1 day ago",
  },
  {
    id: "3",
    title: "GitHub",
    username: "username",
    password: "password123",
    tags: ["work", "development"],
    lastModified: "3 days ago",
  },
   {
    id: "4",
    title: "Twitter / X",
    username: "@username",
    password: "password123",
    tags: ["social"],
    lastModified: "5 days ago",
  },
  {
    id: "5",
    title: "Figma",
    username: "designer@example.com",
    password: "password123",
    tags: ["design", "work"],
    lastModified: "1 week ago",
  },
]

export const notes = [
    {
        id: "n1",
        title: "Project Phoenix Ideas",
        category: "Work",
        content: "Initial brainstorming for the new project architecture, focusing on a microservices-based approach with a central API gateway. Key technologies to investigate: gRPC for inter-service communication, Kubernetes for orchestration, and possibly a service mesh like Istio for observability and traffic management.",
        lastModified: "4 hours ago",
    },
    {
        id: "n2",
        title: "Grocery List",
        category: "Personal",
        content: "Milk, bread, cheese, coffee beans, avocados, chicken breast, olive oil, and some dark chocolate.",
        lastModified: "Yesterday",
    },
    {
        id: "n3",
        title: "API Keys",
        category: "Development",
        content: "Stripe: pk_test_xxxxxxxxxx\nSendGrid: SG.xxxxxxxxxx\nGoogle Maps: AIzaSyxxxxxxxxxx",
        lastModified: "2 days ago",
    },
    {
        id: "n4",
        title: "Meeting Notes 2024-07-20",
        category: "Work",
        content: "Q3 planning session. Key takeaways:\n- Focus on user retention by implementing a new onboarding flow.\n- Increase marketing spend on social media channels.\n- A/B test the new pricing page before full rollout.",
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
