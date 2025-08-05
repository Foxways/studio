import type { ChartConfig } from "@/components/ui/chart"
import { sub } from "date-fns"

export const users = [
    {
        id: "u1",
        name: "Regular User",
        email: "user@example.com",
        password: "password123",
        role: "User",
        active: true,
    },
    {
        id: "u2",
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword",
        role: "Admin",
        active: true,
    },
    {
        id: "u3",
        name: "Bob Williams",
        email: "bob@example.com",
        password: "password123",
        role: "User",
        active: true,
    },
    {
        id: "u4",
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "password123",
        role: "User",
        active: false,
    },
    {
        id: "u5",
        name: "Diana Prince",
        email: "diana@example.com",
        password: "password123",
        role: "User",
        active: true,
    }
]

export const credentials = [
  {
    id: "1",
    title: "Google Account",
    url: "https://google.com",
    username: "user@gmail.com",
    password: "password123",
    tags: ["work", "email"],
    notes: "This is my main Google account for work purposes. Do not share.",
    customFields: [{ id: 1, label: "Recovery Email", value: "recovery@example.com" }],
    lastModified: sub(new Date(), { hours: 2 }).toISOString(),
  },
  {
    id: "2",
    title: "Facebook",
    url: "https://facebook.com",
    username: "user.name",
    password: "password123",
    tags: ["social"],
    notes: "",
    customFields: [],
    lastModified: sub(new Date(), { days: 1 }).toISOString(),
  },
  {
    id: "3",
    title: "GitHub",
    url: "https://github.com",
    username: "username",
    password: "password123",
    tags: ["work", "development"],
    notes: "Used for company private repositories.",
    customFields: [{ id: 1, label: "SSH Key Name", value: "work_rsa" }],
    lastModified: sub(new Date(), { days: 3 }).toISOString(),
  },
   {
    id: "4",
    title: "Twitter / X",
    url: "https://x.com",
    username: "@username",
    password: "password123",
    tags: ["social"],
    notes: "",
    customFields: [],
    lastModified: sub(new Date(), { days: 5 }).toISOString(),
  },
  {
    id: "5",
    title: "Figma",
    url: "https://figma.com",
    username: "designer@example.com",
    password: "password123",
    tags: ["design", "work"],
    notes: "Account for the design team projects.",
    customFields: [],
    lastModified: sub(new Date(), { weeks: 1 }).toISOString(),
  },
]

export const notes = [
    {
        id: "n1",
        title: "Project Phoenix Ideas",
        category: "Work",
        content: "Initial brainstorming for the new project architecture, focusing on a microservices-based approach with a central API gateway. Key technologies to investigate: gRPC for inter-service communication, Kubernetes for orchestration, and possibly a service mesh like Istio for observability and traffic management.",
        lastModified: sub(new Date(), { hours: 4 }).toISOString(),
    },
    {
        id: "n2",
        title: "Grocery List",
        category: "Personal",
        content: "Milk, bread, cheese, coffee beans, avocados, chicken breast, olive oil, and some dark chocolate.",
        lastModified: sub(new Date(), { days: 1 }).toISOString(),
    },
    {
        id: "n3",
        title: "API Keys",
        category: "Development",
        content: "Stripe: pk_test_xxxxxxxxxx\nSendGrid: SG.xxxxxxxxxx\nGoogle Maps: AIzaSyxxxxxxxxxx",
        lastModified: sub(new Date(), { days: 2 }).toISOString(),
    },
    {
        id: "n4",
        title: "Meeting Notes 2024-07-20",
        category: "Work",
        content: "Q3 planning session. Key takeaways:\n- Focus on user retention by implementing a new onboarding flow.\n- Increase marketing spend on social media channels.\n- A/B test the new pricing page before full rollout.",
        lastModified: sub(new Date(), { days: 4 }).toISOString(),
    }
]

export const licenses = [
    {
        id: "l1",
        name: "Adobe Creative Cloud",
        productKey: "ABCD-1234-EFGH-5678",
        purchaseDate: new Date(2023, 7, 15).toISOString(),
        expiryDate: new Date(2024, 7, 15).toISOString(),
    },
    {
        id: "l2",
        name: "Microsoft Office 365",
        productKey: "XYZW-9876-QRST-5432",
        purchaseDate: new Date(2023, 8, 1).toISOString(),
        expiryDate: new Date(2024, 8, 1).toISOString(),
    },
    {
        id: "l3",
        name: "JetBrains All Products Pack",
        productKey: "ASDF-GHJK-LZXC-VBNM",
        purchaseDate: new Date(2024, 0, 10).toISOString(),
        expiryDate: new Date(2025, 0, 10).toISOString(),
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
