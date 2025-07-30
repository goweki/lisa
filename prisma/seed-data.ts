import { PrismaClient, Plan, Feature, Blogpost, User } from "@prisma/client";
const prisma = new PrismaClient();

export const plans: Omit<
  Plan,
  "id" | "createdAt" | "updatedAt" | "isActive"
>[] = [
  {
    name: "starter",
    description: "Starter package for small firms",
    price: 5000,
    priceMonthly: 5000,
    priceAnnual: 50000,
    currency: "KES",
    trialDays: 14,
  },
  {
    name: "team",
    description: "For growing teams with collaboration features",
    price: 15000,
    priceMonthly: 15000,
    priceAnnual: 150000,
    currency: "KES",
    trialDays: 30,
  },
  {
    name: "enterprise",
    description: "Full-scale access and support",
    price: 50000,
    priceMonthly: 50000,
    priceAnnual: 500000,
    currency: "KES",
    trialDays: 30,
  },
];

export const features: Omit<Feature, "id" | "limits">[] = [
  {
    name: "Case Management",
    description: "Create, track, and manage cases.",
    isActive: true,
  },
  {
    name: "User Management",
    description: "Invite and manage users.",
    isActive: true,
  },
  {
    name: "Integrations",
    description: "Email / SMS / WhatsApp integrations.",
    isActive: true,
  },
  {
    name: "Custom Branding",
    description: "Brand the system with your firm’s identity.",
    isActive: true,
  },
  {
    name: "AI Agent",
    description: "AI powered automations",
    isActive: false,
  },
];

export const planFeatureAssociations: Array<{
  plan: string;
  featureNames: string[];
}> = [
  {
    plan: "starter", // ✅ matches name in seedPlans
    featureNames: ["Case Management"],
  },
  {
    plan: "team",
    featureNames: ["Case Management", "User Management", "Integrations"],
  },
  {
    plan: "enterprise",
    featureNames: [
      "Case Management",
      "User Management",
      "Integrations",
      "AI Agent",
      "Custom Branding",
    ],
  },
];

export const defaultCaseTypes = [
  {
    name: "Criminal Case",
    primaryParty: "Complainant",
    secondaryParty: "Accused",
  },
  {
    name: "Civil Dispute",
    primaryParty: "Plaintiff",
    secondaryParty: "Defendant",
  },
  {
    name: "Family Case",
    primaryParty: "Petitioner",
    secondaryParty: "Respondent",
  },
  {
    name: "Land Dispute",
    primaryParty: "Claimant",
    secondaryParty: "Objector",
  },
  {
    name: "Employment Dispute",
    primaryParty: "Employee",
    secondaryParty: "Employer",
  },
];

export const blogPosts: Omit<
  Blogpost,
  "id" | "authorId" | "createdAt" | "updatedAt"
>[] = [
  {
    title:
      "Legal Management Software for Modern Law Firms: Streamline Casework with AI",
    slug: "legal-management-software-modern-law-firms",
    content:
      "Looking for the best legal management software to improve how your law firm operates? Today’s legal professionals face increasing pressure to do more with less — faster. Our platform helps law firms automate tasks, manage cases, and centralize client communication with AI-powered workflows.\n\nWhether you're a solo practitioner or part of a large legal team, this system was built to help you work smarter, not harder. With features like automated case tracking, AI assistants, document management, and internal task delegation, our software replaces scattered tools with one secure, user-friendly platform.\n\nStart managing your legal work the modern way — with automation and AI built right in.",
    excerpt:
      "Discover how modern legal management software improves case tracking, task automation, and communication for law firms.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title:
      "Why Law Firms Need Better Tools: Goodbye Spreadsheets, Hello Automation",
    slug: "why-law-firms-need-legal-tech-tools",
    content:
      "Still managing client cases across email threads, spreadsheets, and sticky notes? You're not alone — and there's a better way. Legal tech is evolving fast, and law firms that embrace automation are saving hours each week.\n\nOur platform is designed to bring structure to your workflow: assign cases with clarity, manage deadlines with reminders, and keep your clients informed — all from one dashboard. Built specifically for legal teams, our system supports growing firms who are tired of duct-taping tools together.\n\nUpgrade your workflow. Empower your legal team. Save time. It's that simple.",
    excerpt:
      "Discover why modern law firms are ditching spreadsheets and embracing automation with legal tech tools built for the job.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title: "How We Built AI-Powered Case Automation for Legal Teams",
    slug: "ai-powered-case-automation-legal-tech",
    content:
      "Case triage is one of the most time-consuming parts of legal operations. That’s why we introduced AI-powered automation — designed to classify legal requests, assign tasks, and streamline workflows.\n\nUsing a combination of large language models and our case management engine, the system can analyze new case entries, identify intent, and trigger internal actions like assigning a lawyer, setting up reminders, or generating first drafts. Everything remains auditable, secure, and role-based.\n\nThis post covers the architecture behind our AI agent, the tech stack (TypeScript, Prisma, PostgreSQL), and how we ensure compliance while letting the AI help lawyers do more meaningful work.",
    excerpt:
      "Learn how we built an AI agent to automate case triage, task assignment, and legal workflows — safely and efficiently.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title: "Reimagining the Legal Workspace: A New Era of Digital Law Practice",
    slug: "digital-legal-workspace-ai-management",
    content:
      "The legal profession is undergoing a quiet revolution. More than ever, law firms are moving away from paper files and toward cloud-based solutions that support remote work, digital documentation, and AI-enhanced task management.\n\nOur legal management system is at the center of this transformation — giving legal professionals a digital workspace that brings together everything they need: smart case organization, AI task assistance, integrated messaging, and powerful team coordination.\n\nThe law office of the future is here. And it's digital, secure, and made to scale.",
    excerpt:
      "Explore how AI, cloud tools, and automation are shaping the digital legal workspace for modern law firms.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
];

export const systemUser: Omit<User, "id" | "photoUrl"> = {
  names: "System Loci",
  email: "loci@goweki.com",
  tel: "0700833003",
  telVerification: false,
  emailVerification: false,
  systemAdmin: true,
  status: "ACTIVE",
  resetTokenSentTo: null,
  password: null,
  resetToken: null,
  resetTokenExpiry: null,
};
