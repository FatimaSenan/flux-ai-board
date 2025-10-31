import { Bot, Users, FileCode, Layers, Zap, Database } from "lucide-react";

export interface MockUser {
  email: string;
  password: string;
  name: string;
  projectIds: number[];
}

export interface MockProject {
  id: number;
  name: string;
  description: string;
  logo: any;
  stats: { users: number; tickets: number };
}

export const mockUsers: MockUser[] = [
  {
    email: "demo@test.com",
    password: "demo123",
    name: "Demo User",
    projectIds: [1, 2],
  },
  {
    email: "mouna@test.com",
    password: "mouna123",
    name: "Mouna",
    projectIds: [2, 3, 4],
  },
  {
    email: "admin@test.com",
    password: "admin123",
    name: "Admin",
    projectIds: [1, 2, 3, 4, 5],
  },
];

export const allProjects: MockProject[] = [
  {
    id: 1,
    name: "AI Assistant Platform",
    description: "Next-generation conversational AI with advanced NLP capabilities.",
    logo: Bot,
    stats: { users: 45, tickets: 128 },
  },
  {
    id: 2,
    name: "Cloud Infrastructure",
    description: "Scalable microservices architecture with Kubernetes orchestration.",
    logo: Layers,
    stats: { users: 32, tickets: 89 },
  },
  {
    id: 3,
    name: "Mobile App Suite",
    description: "Cross-platform mobile applications for iOS and Android.",
    logo: FileCode,
    stats: { users: 28, tickets: 156 },
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    description: "Real-time data visualization and business intelligence platform.",
    logo: Database,
    stats: { users: 52, tickets: 203 },
  },
  {
    id: 5,
    name: "Automation Engine",
    description: "Workflow automation and process optimization system.",
    logo: Zap,
    stats: { users: 38, tickets: 94 },
  },
];
