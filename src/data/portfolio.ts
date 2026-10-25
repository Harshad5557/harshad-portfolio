export type PortfolioProject = {
  title: string
  category: string
  period: string
  description: string
  technologies: string[]
  highlights: string[]
}

export const portfolioEmail = 'harshaddike1232@gmail.com'
export const portfolioUpdatedAt = '2026-10-25'

export const experiences = [
  {
    role: 'Backend Machine Learning Engineer Intern',
    organization: 'Infosys Springboard Internship 6.0',
    period: 'August 2025 – October 2025',
    description:
      'Worked with a four-member Agile team on a predictive transaction intelligence solution for the BFSI domain.',
    contributions: [
      'Prepared more than 50,000 transaction records for an ML pipeline.',
      'Engineered eight JSON REST API endpoints.',
      'Contributed to a scikit-learn pipeline with SMOTE resampling and probability-threshold tuning.',
      'Resolved more than 25 software defects through code reviews and mentor demonstrations.',
    ],
    technologies: ['Python', 'FastAPI', 'scikit-learn', 'MySQL', 'REST APIs'],
  },
  {
    role: 'Software Developer Intern',
    organization: 'ScaleFull Technologies LLP',
    period: 'December 2024 – February 2025',
    location: 'Pune, India',
    description:
      'Contributed to a multi-page recipe management website using MERN-related technologies.',
    contributions: [
      'Built REST API endpoints for recipe creation, search, categorization, and CRUD operations.',
      'Developed CSS3 interface views integrated with the React frontend.',
      'Fixed asynchronous data-fetching issues between backend and frontend.',
      'Wrote API test cases and applied MongoDB schema validation.',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'CSS3'],
  },
]

export const projects: PortfolioProject[] = [
  {
    title: 'Predictive Transaction Intelligence for BFSI',
    category: 'Machine learning · Backend engineering',
    period: 'August 2025 – October 2025',
    description:
      'A team-built transaction intelligence system combining a scikit-learn classification pipeline, FastAPI endpoints, and MySQL-backed analytics.',
    technologies: ['Python', 'FastAPI', 'scikit-learn', 'SMOTE', 'MySQL'],
    highlights: [
      'Prepared 50,000+ transaction records.',
      'Built eight JSON-based REST endpoints.',
      'Reported project results include 91.4% classification accuracy.',
    ],
  },
  {
    title: 'MineSafe-AI',
    category: 'Computer vision · Web application',
    period: '2025 – 2026',
    description:
      'A final-year team project combining a Django safety-monitoring portal with a computer-vision pipeline for PPE detection.',
    technologies: ['Python', 'Django', 'OpenCV', 'YOLOv8', 'ViT-Pose'],
    highlights: [
      'Reported processing throughput improved from 12 FPS to 28 FPS.',
      'The project resulted in a co-authored paper published at IEEE ICCSGD 2026.',
      'Reported detection accuracy was approximately 93% across 1,000+ test video frames.',
    ],
  },
  {
    title: 'QuickChat',
    category: 'Full stack · Real-time systems',
    period: '2024 – 2025',
    description:
      'A personal real-time messaging project exploring private one-to-one chat, authenticated HTTP and WebSocket flows, and CI/CD.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Socket.IO', 'MongoDB'],
    highlights: [
      'Implemented JWT authentication across HTTP routes and WebSocket connections.',
      'Built reusable React hooks for socket communication.',
      'Load-tested 50+ concurrent socket connections in the reported test environment.',
    ],
  },
]

export const research = {
  title: 'MineSafe-AI: Worker Safety Monitoring System',
  venue:
    'IEEE International Conference on Computing Systems for Green and Development (ICCSGD 2026)',
  institution: 'BVICAM, New Delhi',
  summary:
    'Co-authored research on an AI-assisted worker safety monitoring system using computer vision and machine learning.',
  technologies: ['YOLOv8', 'ViT-Pose', 'Computer vision', 'Django', 'Python'],
}

export const education = [
  {
    qualification: 'Bachelor of Engineering in Computer Engineering',
    institution:
      'Dr. Vithalrao Vikhe Patil College of Engineering, Ahilyanagar',
    date: 'July 2026',
    result: '7.82 / 10 CGPA',
  },
  {
    qualification: 'HSC — Science',
    institution: 'Maharashtra State Board',
    date: 'February 2022',
    result: '81%',
  },
  {
    qualification: 'SSC',
    institution: 'Maharashtra State Board',
    date: 'March 2020',
    result: '91%',
  },
]

export const certifications = [
  {
    title: 'Take Control of Your Data with Watson Studio',
    issuer: 'IBM SkillsBuild',
  },
  {
    title: 'Retrieval Augmented Generation with LangChain (RAG & LLM)',
    issuer: 'Lab — Online Course',
  },
  {
    title: 'Journey to Cloud: Envisioning Your Solution',
    issuer: 'IBM SkillsBuild',
  },
  { title: 'Getting Started with AI', issuer: 'Infosys Springboard' },
  { title: 'AI Primer', issuer: 'Infosys Springboard' },
  { title: 'Principles of Generative AI', issuer: 'Infosys Springboard' },
]

export const aboutPrinciples = [
  {
    title: 'Clean architecture',
    description:
      'Maintainable applications with a clear separation of responsibilities.',
  },
  {
    title: 'API-first thinking',
    description:
      'Reliable interfaces between user-facing applications, services, and data.',
  },
  {
    title: 'Performance matters',
    description:
      'Measure bottlenecks, improve processing efficiency, and validate results.',
  },
  {
    title: 'Continuous learning',
    description:
      'Strengthen fundamentals through projects, debugging, and technical problem-solving.',
  },
]

export const faqItems = [
  {
    question: 'What kind of engineering work do you focus on?',
    answer:
      'Full-stack application development, backend services, real-time experiences, and practical machine-learning solutions.',
  },
  {
    question: 'Where are you based?',
    answer: 'Pune, Maharashtra, India.',
  },
  {
    question: 'Where can I see your work?',
    answer:
      'Visit the GitHub profile for available repositories. Project cards link directly only when a public project URL is available.',
  },
  {
    question: 'How can I get in touch?',
    answer:
      'Email is the most direct option. The contact section also lets you copy the address or prepare an email draft.',
  },
]

export const searchableContent = [
  { title: 'About', section: 'about', keywords: 'engineer computer engineering approach principles' },
  { title: 'Technical Skills', section: 'skills', keywords: 'languages python javascript typescript sql backend frontend authentication databases caching devops ai machine learning' },
  { title: 'Experience', section: 'experience', keywords: 'Infosys Springboard ScaleFull intern internship backend developer' },
  { title: 'Projects', section: 'projects', keywords: projects.map((project) => `${project.title} ${project.category} ${project.description} ${project.technologies.join(' ')}`).join(' ') },
  { title: 'Research', section: 'research', keywords: `${research.title} ${research.venue} ${research.summary}` },
  { title: 'Education', section: 'education', keywords: education.map((item) => `${item.qualification} ${item.institution}`).join(' ') },
  { title: 'Certifications', section: 'certifications', keywords: certifications.map((item) => `${item.title} ${item.issuer}`).join(' ') },
  { title: 'Contact', section: 'contact', keywords: 'email Pune LinkedIn GitHub LeetCode' },
  { title: 'Frequently Asked Questions', section: 'faq', keywords: faqItems.map((item) => `${item.question} ${item.answer}`).join(' ') },
]
