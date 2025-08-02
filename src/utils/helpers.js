export const getWeeksSinceJoined = (joinedAt) => {
  if (!joinedAt) return 1
  const joinDate = new Date(joinedAt)
  const now = new Date()
  const weeksDiff = Math.ceil((now - joinDate) / (1000 * 60 * 60 * 24 * 7))
  return Math.max(1, weeksDiff)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const generateAvatar = (seed) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}