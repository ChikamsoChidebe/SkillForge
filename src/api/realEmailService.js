import emailjs from '@emailjs/browser'

// Real email service using EmailJS
export const realEmailService = {
  // Initialize EmailJS
  init() {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (publicKey) {
      emailjs.init(publicKey)
    }
  },

  // Send email using EmailJS
  async sendEmail(templateParams) {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      
      if (!serviceId || !templateId) {
        console.warn('EmailJS not configured - check environment variables')
        return { success: false, error: 'Email service not configured' }
      }

      const response = await emailjs.send(serviceId, templateId, templateParams)
      console.log('✅ Email sent successfully:', response)
      return { success: true, response }
    } catch (error) {
      console.error('❌ Email failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Welcome email
  async sendWelcomeEmail(userData) {
    return await this.sendEmail({
      to_name: userData.fullName || userData.username,
      to_email: userData.email,
      subject: '🎉 Welcome to SkillForge!',
      message: `Hi ${userData.fullName || userData.username}!

Welcome to SkillForge - your blockchain-verified learning platform!

🚀 What you can do now:
• Record learning milestones
• Earn NFT badges  
• Build your portfolio
• Get AI insights

Start your journey: ${window.location.origin}/dashboard

Best regards,
The SkillForge Team`
    })
  },

  // Badge unlock email
  async sendBadgeUnlockedEmail(userData, badgeData) {
    return await this.sendEmail({
      to_name: userData.fullName || userData.username,
      to_email: userData.email,
      subject: `🏆 Badge Unlocked: ${badgeData.name}!`,
      message: `Congratulations ${userData.fullName || userData.username}!

You've unlocked the "${badgeData.name}" badge! ${badgeData.icon}

${badgeData.description}

Your Progress:
• ${userData.totalEntries || 0} learning entries
• ${userData.totalBadges || 1} badges earned
• ${userData.learningStreak || 0} day streak

View your badges: ${window.location.origin}/badges

Keep learning!
The SkillForge Team`
    })
  },

  // Progress reminder email
  async sendProgressReminder(userData) {
    return await this.sendEmail({
      to_name: userData.fullName || userData.username,
      to_email: userData.email,
      subject: '📈 Keep your learning momentum!',
      message: `Hi ${userData.fullName || userData.username}!

We noticed you haven't logged any learning recently. Don't lose your momentum!

💡 Quick ideas:
• Log a tutorial you completed
• Record project progress  
• Document new skills
• Add course completion

Continue learning: ${window.location.origin}/log-entry

Best regards,
The SkillForge Team`
    })
  }
}

// Initialize on import
realEmailService.init()