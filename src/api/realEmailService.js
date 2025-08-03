// Email service using Netlify Functions
export const realEmailService = {
  init() {
    console.log('📧 Email service ready - Netlify Functions + Resend')
  },

  async sendEmail(templateParams) {
    try {
      // Try Netlify function first (production)
      const netlifyResult = await this.sendViaNetlify(templateParams)
      if (netlifyResult.success) return netlifyResult
      
      // Fallback to console preview
      console.log('\n🎆 ═══════════════════════════════════════')
      console.log('📧 ✨ EMAIL PREVIEW (Development) ✨')
      console.log('═══════════════════════════════════════')
      console.log(`📬 To: ${templateParams.to_email}`)
      console.log(`📝 Subject: ${templateParams.subject}`)
      console.log('───────────────────────────────────────')
      
      const cleanMessage = templateParams.message
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      console.log(cleanMessage)
      console.log('───────────────────────────────────────')
      console.log('✅ Deploy to Netlify for real emails!')
      console.log('🎆 ═══════════════════════════════════════\n')
      
      return { success: true, message: 'Email preview displayed' }
    } catch (error) {
      console.error('❌ Email service error:', error)
      return { success: false, error: error.message }
    }
  },

  async sendViaNetlify(templateParams) {
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateParams)
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        console.log('✅ Real email sent via Netlify + Resend!')
        console.log('📧 Email ID:', result.id)
        return { success: true, response: result }
      } else {
        throw new Error(result.error || 'Netlify function failed')
      }
    } catch (error) {
      console.log('⚠️ Netlify function not available:', error.message)
      return { success: false, error: error.message }
    }
  },

  // Welcome email with custom HTML design
  async sendWelcomeEmail(userData) {
    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 10px; overflow: hidden;">
      <div style="background: white; margin: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚀 Welcome to SkillForge!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Blockchain Learning Journey Starts Now</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hi ${userData.fullName || userData.username}! 👋</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
            Welcome to SkillForge - the revolutionary platform where your learning achievements are permanently recorded on the blockchain!
          </p>
          
          <div style="background: #f8f9ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🎆 What You Can Do Now:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>📝 <strong>Record Learning Milestones</strong> - Log tutorials, courses, projects</li>
              <li>🏆 <strong>Earn NFT Badges</strong> - Unlock achievements as you progress</li>
              <li>📈 <strong>Build Your Portfolio</strong> - Showcase verified skills</li>
              <li>🤖 <strong>Get AI Insights</strong> - Personalized learning recommendations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              🚀 Start Your Journey
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              🔒 Your learning data is secured on Hedera blockchain<br>
              Questions? Reply to this email - we're here to help!
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9ff; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            Best regards,<br>
            <strong style="color: #333;">The SkillForge Team</strong> 🎆
          </p>
        </div>
      </div>
    </div>`
    
    return await this.sendEmail({
      to_name: userData.fullName || userData.username,
      to_email: userData.email,
      subject: '🎉 Welcome to SkillForge - Your Blockchain Learning Journey Begins!',
      message: htmlMessage
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