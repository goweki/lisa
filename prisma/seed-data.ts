import { Plan, Feature, Blogpost, User } from "@prisma/client";

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
      "Legal Management Software for Modern Law Firms: Streamline Casework Without the Chaos",
    slug: "legal-management-software-modern-law-firms",
    content:
      "Looking for the best legal management software to improve how your law firm operates? Today’s legal professionals face increasing pressure to do more with less — faster. Our platform helps law firms streamline tasks, manage casework, and centralize client communication — all in one place.\n\nWhether you're a solo practitioner or part of a large legal team, this system was built to help you work smarter, not harder. With features like structured case tracking, document management, and internal task delegation, our software replaces scattered tools with one secure, user-friendly platform.\n\nStart managing your legal work the modern way — and prepare your firm for the future of legal practice.",
    excerpt:
      "Discover how modern legal management software improves case tracking, task flow, and communication for law firms.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title:
      "Why Law Firms Need Better Tools: Goodbye Spreadsheets, Hello Structure",
    slug: "why-law-firms-need-legal-tech-tools",
    content:
      "Still managing client cases across email threads, spreadsheets, and sticky notes? You're not alone — and there's a better way. Legal operations are evolving, and firms that adopt smarter systems are saving hours each week.\n\nOur platform is designed to bring order to your workflow: assign cases clearly, manage deadlines with built-in reminders, and keep clients informed — all from a single dashboard. Built specifically for legal teams, our system supports growing firms who are tired of duct-taping tools together.\n\nUpgrade your workflow. Empower your team. Reduce risk. It's that simple.",
    excerpt:
      "Discover why law firms are ditching spreadsheets and embracing smarter systems built for legal teams.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title: "Designing Case Workflow Automation for Legal Teams",
    slug: "workflow-automation-legal-tech",
    content:
      "Case intake and task coordination are some of the most repetitive aspects of legal work. That’s why we built automation features that help classify legal requests, assign tasks, and streamline follow-ups.\n\nUsing well-defined logic and our case management engine, the system can guide new case entries, route internal actions, and support compliance requirements. Every step is traceable, secure, and tailored to your legal team's structure.\n\nThis post walks through how we built our workflow automation engine using TypeScript, Prisma, and PostgreSQL — and how it lays the foundation for future AI enhancements launching in 2026.",
    excerpt:
      "Learn how we structured workflow automation to streamline legal task management — and what’s coming next.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
  {
    title: "Reimagining the Legal Workspace: A New Era of Digital Law Practice",
    slug: "digital-legal-workspace-management",
    content:
      "The legal profession is shifting. Law firms are increasingly moving away from paper-based systems and toward digital platforms that support remote work, secure documentation, and team coordination.\n\nOur legal management system is built to support this transformation — giving legal professionals a digital workspace that brings together everything they need: structured case organization, task workflows, messaging, and real-time collaboration.\n\nThe law office of the future isn’t in the future anymore. It’s digital, secure, and ready for growth.",
    excerpt:
      "Explore how cloud tools and modern platforms are shaping the digital legal workspace for today’s law firms.",
    coverImage: null,
    published: true,
    status: "PUBLISHED",
  },
];

export const systemUser: Omit<User, "id" | "photoUrl"> = {
  names: "System Lisa",
  email: "lisa@goweki.com",
  tel: null,
  telVerification: false,
  emailVerification: false,
  systemAdmin: true,
  status: "ACTIVE",
  resetTokenSentTo: null,
  password: null,
  resetToken: null,
  resetTokenExpiry: null,
};
