// Quick test to check if environment variables are loaded
console.log('🔍 Environment Variables Test:')
console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID)
console.log('VITE_EMAILJS_TEMPLATE_ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID)
console.log('VITE_EMAILJS_PUBLIC_KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)

// Test if they exist
const emailConfigured = !!(
  import.meta.env.VITE_EMAILJS_SERVICE_ID && 
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID && 
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)

console.log('✅ EmailJS Configured:', emailConfigured)