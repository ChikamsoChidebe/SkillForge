export const LEARNING_CATEGORIES = [
  { value: 'tutorial', label: 'Tutorial', icon: '📚', color: 'blue' },
  { value: 'project', label: 'Project', icon: '🚀', color: 'green' },
  { value: 'course', label: 'Course', icon: '🎓', color: 'purple' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️', color: 'orange' },
  { value: 'certification', label: 'Certification', icon: '🏆', color: 'yellow' },
  { value: 'book', label: 'Book', icon: '📖', color: 'indigo' },
  { value: 'video', label: 'Video', icon: '🎥', color: 'pink' },
  { value: 'practice', label: 'Practice', icon: '💪', color: 'teal' }
]

export const BADGE_RARITIES = {
  common: {
    label: 'Common',
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600'
  },
  uncommon: {
    label: 'Uncommon',
    color: 'green',
    gradient: 'from-green-400 to-green-600'
  },
  rare: {
    label: 'Rare',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-600'
  },
  legendary: {
    label: 'Legendary',
    color: 'yellow',
    gradient: 'from-yellow-400 to-orange-600'
  }
}

export const MILESTONE_BADGES = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Completed your first learning entry',
    milestone: 1,
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'learning-streak',
    name: 'Learning Streak',
    description: 'Logged 5 learning milestones',
    milestone: 5,
    icon: '🔥',
    rarity: 'uncommon'
  },
  {
    id: 'knowledge-builder',
    name: 'Knowledge Builder',
    description: 'Reached 10 learning entries',
    milestone: 10,
    icon: '🏗️',
    rarity: 'rare'
  },
  {
    id: 'learning-master',
    name: 'Learning Master',
    description: 'Achieved 20 learning milestones',
    milestone: 20,
    icon: '👑',
    rarity: 'legendary'
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Completed 50 learning entries',
    milestone: 50,
    icon: '🌟',
    rarity: 'legendary'
  },
  {
    id: 'learning-legend',
    name: 'Learning Legend',
    description: 'Reached the incredible milestone of 100 entries',
    milestone: 100,
    icon: '🏆',
    rarity: 'legendary'
  }
]

export const HEDERA_CONFIG = {
  TESTNET: {
    name: 'Hedera Testnet',
    networkId: 'testnet',
    mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
    hashscanUrl: 'https://hashscan.io/testnet'
  },
  MAINNET: {
    name: 'Hedera Mainnet',
    networkId: 'mainnet',
    mirrorNodeUrl: 'https://mainnet-public.mirrornode.hedera.com',
    hashscanUrl: 'https://hashscan.io/mainnet'
  }
}

export const QUERY_KEYS = {
  ENTRIES: 'entries',
  BADGES: 'badges',
  USER_PROFILE: 'userProfile',
  ACCOUNT_BALANCE: 'accountBalance'
}

export const LOCAL_STORAGE_KEYS = {
  USER: 'devchain_user',
  THEME: 'devchain_theme',
  PROFILE: 'devchain_profile',
  SETTINGS: 'devchain_settings'
}

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
}

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

export const MAX_LENGTHS = {
  TITLE: 100,
  DESCRIPTION: 500,
  BIO: 200,
  MEMO: 100
}

export const SOCIAL_PLATFORMS = [
  { name: 'GitHub', icon: 'Github', baseUrl: 'https://github.com/' },
  { name: 'Twitter', icon: 'Twitter', baseUrl: 'https://twitter.com/' },
  { name: 'LinkedIn', icon: 'Linkedin', baseUrl: 'https://linkedin.com/in/' },
  { name: 'Website', icon: 'Globe', baseUrl: '' }
]