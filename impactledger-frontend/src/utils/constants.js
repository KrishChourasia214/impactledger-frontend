export const CAUSE_AREAS = [
  { value: 'education', label: 'Education', icon: '📚', color: 'bg-blue-100 text-blue-700' },
  { value: 'health', label: 'Healthcare', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { value: 'environment', label: 'Environment', icon: '🌱', color: 'bg-green-100 text-green-700' },
  { value: 'water', label: 'Water & Sanitation', icon: '💧', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'livelihood', label: 'Livelihood', icon: '💼', color: 'bg-amber-100 text-amber-700' },
  { value: 'women', label: 'Women Empowerment', icon: '👩', color: 'bg-pink-100 text-pink-700' },
  { value: 'children', label: 'Child Welfare', icon: '👶', color: 'bg-purple-100 text-purple-700' },
  { value: 'rural', label: 'Rural Development', icon: '🏘️', color: 'bg-orange-100 text-orange-700' },
]

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

export const LANGUAGES = [
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'