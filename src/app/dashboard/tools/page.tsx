import Link from "next/link";
import { Bot, HeartPulse, ScanSearch, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";

const tools = [
  {
    href: "/dashboard/tools/password-generator",
    label: "Password Generator",
    description: "Create strong, complex passwords with AI.",
    icon: Bot,
  },
  {
    href: "/dashboard/tools/password-analyzer",
    label: "Password Analyzer",
    description: "Analyze strength and check for compromises.",
    icon: HeartPulse,
  },
  {
    href: "/dashboard/tools/phishing-detector",
    label: "Phishing Detector",
    description: "Scan URLs for potential phishing threats.",
    icon: ScanSearch,
  },
  {
    href: "/dashboard/tools/dark-web-monitor",
    label: "Dark Web Monitor",
    description: "Check if your credentials are on the dark web.",
    icon: ShieldAlert,
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Security Tools"
        description="Leverage AI-powered tools to enhance your security."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <GlassCard className="hover:border-primary/80 transition-colors h-full">
              <div className="flex items-start gap-4">
                <tool.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{tool.label}</h3>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </>
  );
}
