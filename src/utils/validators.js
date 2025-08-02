export const validateTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return 'Title is required'
  }
  if (title.length < 3) {
    return 'Title must be at least 3 characters long'
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters'
  }
  return null
}

export const validateDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return 'Description is required'
  }
  if (description.length < 10) {
    return 'Description must be at least 10 characters long'
  }
  if (description.length > 500) {
    return 'Description must be less than 500 characters'
  }
  return null
}

export const validateDate = (date) => {
  if (!date) {
    return 'Date is required'
  }
  
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  if (selectedDate > today) {
    return 'Date cannot be in the future'
  }
  
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  
  if (selectedDate < oneYearAgo) {
    return 'Date cannot be more than a year ago'
  }
  
  return null
}

export const validateCategory = (category) => {
  const validCategories = ['tutorial', 'project', 'course', 'workshop', 'certification', 'book', 'video', 'practice']
  
  if (!category) {
    return 'Category is required'
  }
  
  if (!validCategories.includes(category)) {
    return 'Invalid category selected'
  }
  
  return null
}

export const validateEmail = (email) => {
  if (!email) return null // Email is optional
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  
  return null
}

export const validateUrl = (url) => {
  if (!url) return null // URL is optional
  
  try {
    new URL(url)
    return null
  } catch {
    return 'Please enter a valid URL'
  }
}

export const validateAccountId = (accountId) => {
  if (!accountId) {
    return 'Account ID is required'
  }
  
  // Hedera account ID format: 0.0.xxxxx
  const accountIdRegex = /^0\.0\.\d+$/
  if (!accountIdRegex.test(accountId)) {
    return 'Invalid Hedera account ID format'
  }
  
  return null
}

export const validateFormData = (data) => {
  const errors = {}
  
  const titleError = validateTitle(data.title)
  if (titleError) errors.title = titleError
  
  const descriptionError = validateDescription(data.description)
  if (descriptionError) errors.description = descriptionError
  
  const dateError = validateDate(data.date)
  if (dateError) errors.date = dateError
  
  const categoryError = validateCategory(data.category)
  if (categoryError) errors.category = categoryError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}