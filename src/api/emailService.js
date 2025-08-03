// Professional Email Service for SkillForge
export const emailService = {
  // Email templates with DevChain branding
  templates: {
    welcome: (userData) => ({
      subject: '🎉 Welcome to SkillForge - Your Learning Journey Begins!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="background: rgba(255,255,255,0.95); margin: 20px; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px; font-weight: bold;">SF</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to SkillForge!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your blockchain-verified learning journey starts now</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">Hi ${userData.username}! 👋</h2>
              <p style="color: #4B5563; line-height: 1.6; margin: 0 0 25px; font-size: 16px;">
                Congratulations on joining SkillForge! You're now part of a revolutionary platform that makes your learning achievements verifiable and permanent on the blockchain.
              </p>
              
              <!-- Features -->
              <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1F2937; margin: 0 0 15px; font-size: 18px;">🚀 What you can do now:</h3>
                <ul style="color: #4B5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>Record learning milestones</strong> - Tutorials, courses, projects</li>
                  <li><strong>Earn NFT badges</strong> - Unlock achievements as you progress</li>
                  <li><strong>Build your portfolio</strong> - Showcase verified skills to employers</li>
                  <li><strong>Get AI insights</strong> - Personalized learning recommendations</li>
                </ul>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/dashboard" style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Start Your Journey →
                </a>
              </div>
              
              <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 25px 0 0;">
                Need help? Reply to this email or visit our <a href="${window.location.origin}" style="color: #3B82F6;">help center</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #F3F4F6; padding: 20px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; margin: 0; font-size: 12px;">
                © 2024 SkillForge. Building the future of verifiable learning.
              </p>
            </div>
          </div>
        </div>
      `
    }),

    badgeUnlocked: (userData, badgeData) => ({
      subject: `🏆 Congratulations! You've unlocked the "${badgeData.name}" badge!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="background: rgba(255,255,255,0.95); margin: 20px; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #F59E0B, #EF4444); padding: 40px 30px; text-align: center;">
              <div style="font-size: 60px; margin-bottom: 15px;">${badgeData.icon}</div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Badge Unlocked! 🎉</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">You've achieved a new milestone</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; text-align: center;">
              <h2 style="color: #1F2937; margin: 0 0 10px; font-size: 24px;">${badgeData.name}</h2>
              <div style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #92400E; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: 600; margin-bottom: 20px;">
                ${badgeData.rarity.toUpperCase()} BADGE
              </div>
              <p style="color: #4B5563; line-height: 1.6; margin: 0 0 25px; font-size: 16px;">
                ${badgeData.description}
              </p>
              
              <!-- Stats -->
              <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1F2937; margin: 0 0 15px; font-size: 18px;">📊 Your Progress</h3>
                <p style="color: #4B5563; margin: 0; font-size: 16px;">
                  <strong>${userData.totalEntries || 0}</strong> learning entries recorded<br>
                  <strong>${userData.totalBadges || 1}</strong> badges earned<br>
                  <strong>${userData.learningStreak || 0}</strong> day learning streak
                </p>
              </div>
              
              <!-- CTA -->
              <div style="margin: 30px 0;">
                <a href="${window.location.origin}/badges" style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; margin-right: 10px;">
                  View All Badges
                </a>
                <a href="${window.location.origin}/profile" style="background: transparent; color: #3B82F6; padding: 15px 30px; text-decoration: none; border: 2px solid #3B82F6; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Share Achievement
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    }),

    progressReminder: (userData) => ({
      subject: '📈 Keep your learning momentum going!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="background: rgba(255,255,255,0.95); margin: 20px; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10B981, #3B82F6); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Don't lose momentum!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your learning journey is waiting</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1F2937; margin: 0 0 20px; font-size: 24px;">Hi ${userData.username}! 👋</h2>
              <p style="color: #4B5563; line-height: 1.6; margin: 0 0 25px; font-size: 16px;">
                We noticed you haven't logged any learning activities recently. Keep building your blockchain-verified portfolio!
              </p>
              
              <!-- Quick Actions -->
              <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1F2937; margin: 0 0 15px; font-size: 18px;">💡 Quick ideas to get back on track:</h3>
                <ul style="color: #4B5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Log a tutorial you completed recently</li>
                  <li>Record progress on a current project</li>
                  <li>Document a new skill you're learning</li>
                  <li>Add a course or workshop you attended</li>
                </ul>
              </div>
              
              <!-- CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}/log-entry" style="background: linear-gradient(135deg, #10B981, #3B82F6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Add Learning Entry →
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    })
  },

  // Send email function (uses EmailJS for client-side sending)
  async sendEmail(template, userData, additionalData = {}) {
    try {
      const emailData = this.templates[template](userData, additionalData)
      
      // For demo purposes, we'll log the email
      console.log('📧 Email would be sent:', {
        to: userData.email,
        subject: emailData.subject,
        template: template
      })
      
      // In production, integrate with EmailJS, SendGrid, or similar service
      // Example with EmailJS:
      /*
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          to_email: userData.email,
          to_name: userData.username,
          subject: emailData.subject,
          html_content: emailData.html
        },
        'YOUR_PUBLIC_KEY'
      )
      */
      
      return { success: true, message: 'Email sent successfully' }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: error.message }
    }
  },

  // Automated email triggers
  async sendWelcomeEmail(userData) {
    return await this.sendEmail('welcome', userData)
  },

  async sendBadgeUnlockedEmail(userData, badgeData) {
    return await this.sendEmail('badgeUnlocked', userData, badgeData)
  },

  async sendProgressReminder(userData) {
    return await this.sendEmail('progressReminder', userData)
  },

  async sendWeeklyDigest(userData, weeklyData) {
    return await this.sendEmail('weeklyDigest', userData, weeklyData)
  }
}