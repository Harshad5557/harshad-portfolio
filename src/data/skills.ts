import {
  siCss,
  siDocker,
  siExpress,
  siFastapi,
  siGit,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLangchain,
  siLinux,
  siMysql,
  siMongodb,
  siNodedotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siScikitlearn,
  siSocketdotio,
  // siSwagger,
  siTensorflow,
  siTypescript,
  // siVercel,
  type SimpleIcon,
} from 'simple-icons'
import type { LucideIcon } from 'lucide-react'
import {
  Binary,
  Boxes,
  Code2,
  // Cog,
  // Container,
  Database,
  DatabaseZap,
  // GitBranch,
  Gauge,
  KeyRound,
  Layers3,
  ListOrdered,
  Mail,
  Minimize2,
  MonitorCog,
  Network,
  PanelsTopLeft,
  Scale,
  SearchCheck,
  // Server,
  ShieldCheck,
  // Timer,
  Workflow,
} from 'lucide-react'

export type Skill = {
  name: string
  logo?: SimpleIcon
  fallback: LucideIcon
}

export type SkillCategory = {
  name: string
  description: string
  skills: Skill[]
}

function branded(name: string, logo: SimpleIcon): Skill {
  return { name, logo, fallback: Code2 }
}

function concept(name: string, fallback: LucideIcon): Skill {
  return { name, fallback }
}

export const skillCategories = [
  {
    name: 'Languages',
    description: 'The building blocks behind my applications.',
    skills: [
      branded('Python', siPython),
      branded('JavaScript', siJavascript),
      branded('TypeScript', siTypescript),
      concept('SQL', Database),
    ],
  },

  {
    name: 'Backend Development',
    description: 'APIs, application services, and real-time systems.',
    skills: [
      branded('Node.js', siNodedotjs),
      branded('Express.js', siExpress),
      branded('FastAPI', siFastapi),
      concept('REST APIs', Workflow),
      branded('Socket.IO', siSocketdotio),
      concept('BullMQ', Layers3),
    ],
  },

  {
    name: 'Frontend Development',
    description: 'Responsive, accessible interfaces for the web.',
    skills: [
      branded('React.js', siReact),
      branded('HTML5', siHtml5),
      branded('CSS3', siCss),
      concept('Responsive Web Design', PanelsTopLeft),
    ],
  },

  {
    name: 'Authentication & Security',
    description: 'Identity, access control, and application safeguards.',
    skills: [
      branded('JWT', siJsonwebtokens),
      concept('Authentication', ShieldCheck),
      concept('Authorization', KeyRound),
      concept('Rate Limiting', Gauge),
    ],
  },

  {
    name: 'Databases',
    description: 'Relational and document databases, optimized for retrieval.',
    skills: [
      branded('PostgreSQL', siPostgresql),
      branded('MySQL', siMysql),
      branded('MongoDB', siMongodb),
      concept('Connection Pooling', DatabaseZap),
      concept('Pagination', ListOrdered),
    ],
  },

  {
    name: 'Caching & Message Queues',
    description: 'Low-latency data access and reliable asynchronous processing.',
    skills: [
      branded('Redis', siRedis),
      concept('Caching Strategies', Layers3),
      concept('BullMQ & Background Jobs', Workflow),
      concept('Email Queues & Workers', Mail),
    ],
  },

  {
    name: 'Performance Optimization',
    description: 'Reducing latency and improving application efficiency.',
    skills: [
      concept('Response Compression', Minimize2),
      concept('Database Query Optimization', DatabaseZap),
      concept('Efficient Data Retrieval', SearchCheck),
    ],
  },

  {
    name: 'DevOps & Tools',
    description: 'Containerization, version control, automation, and deployment.',
    skills: [
      branded('Docker', siDocker),
      branded('Docker Compose', siDocker),
      branded('Git & GitHub', siGit),
      branded('GitHub Actions', siGithubactions),
      branded('Postman', siPostman),
      branded('Linux', siLinux),
    ],
  },

  {
    name: 'AI / ML',
    description: 'Machine learning, computer vision, and generative AI applications.',
    skills: [
      branded('Scikit-learn', siScikitlearn),
      branded('TensorFlow', siTensorflow),
      branded('NumPy', siNumpy),
      branded('Pandas', siPandas),
      branded('OpenCV', siOpencv),
      branded('Gemini API', siGooglegemini),
      branded('LangChain', siLangchain),
    ],
  },

  {
    name: 'Core Computer Science',
    description: 'Computer science fundamentals and scalable system architecture.',
    skills: [
      concept('OOP', Boxes),
      concept('DSA', Binary),
      concept('DBMS', Database),
      concept('Operating Systems', MonitorCog),
      concept('System Design', Workflow),
      concept('Client-Server Architecture', Network),
      concept('Scalability & Load Balancing', Scale),
    ],
  },
];