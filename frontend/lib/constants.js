export const APP_NAME = 'SkillForgeAI';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SETUP: '/setup',
  DASHBOARD: '/dashboard',
  CHATBOT: '/dashboard/chatbot',
  TASKS: '/dashboard/tasks',
  ROADMAP: '/dashboard/roadmap',
  SETTINGS: '/dashboard/settings',
};

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Looking to master' },
];

export const SKILL_CATEGORIES = [
  { id: 'dsa', label: 'Data Structures & Algorithms', icon: '🔢' },
  { id: 'webdev', label: 'Web Development', icon: '🌐' },
  { id: 'system-design', label: 'System Design', icon: '🏗️' },
  { id: 'databases', label: 'Databases & SQL', icon: '🗄️' },
  { id: 'os', label: 'Operating Systems', icon: '💻' },
  { id: 'networking', label: 'Computer Networks', icon: '🌍' },
];
