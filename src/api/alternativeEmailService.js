// Alternative email services that work better than EmailJS

// Option 1: Web3Forms (Free, no API key needed)
export const web3FormsService = {
  async sendEmail(templateParams) {
    try {
      const formData = new FormData()
      formData.append('access_key', 'YOUR_WEB3FORMS_KEY') // Get free key from web3forms.com
      formData.append('subject', templateParams.subject)
      formData.append('email', templateParams.to_email)
      formData.append('name', templateParams.to_name)
      formData.append('message', templateParams.message)
      formData.append('from_name', 'SkillForge')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Web3Forms email sent successfully')
        return { success: true, response: result }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('❌ Web3Forms email failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// Option 2: Formspree (Free tier available)
export const formspreeService = {
  async sendEmail(templateParams) {
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: templateParams.to_email,
          name: templateParams.to_name,
          subject: templateParams.subject,
          message: templateParams.message,
          _replyto: templateParams.to_email,
          _subject: templateParams.subject
        })
      })

      if (response.ok) {
        console.log('✅ Formspree email sent successfully')
        return { success: true, response: await response.json() }
      } else {
        throw new Error('Formspree request failed')
      }
    } catch (error) {
      console.error('❌ Formspree email failed:', error)
      return { success: false, error: error.message }
    }
  }
}

// Option 3: Simple SMTP.js (Works in browser)
export const smtpJsService = {
  async sendEmail(templateParams) {
    try {
      // Load SMTP.js if not already loaded
      if (typeof Email === 'undefined') {
        await this.loadSmtpJs()
      }

      const result = await Email.send({
        SecureToken: "YOUR_SMTPJS_TOKEN", // Get from smtpjs.com
        To: templateParams.to_email,
        From: "noreply@skillforge.dev",
        Subject: templateParams.subject,
        Body: templateParams.message
      })

      if (result === 'OK') {
        console.log('✅ SMTP.js email sent successfully')
        return { success: true, response: result }
      } else {
        throw new Error(result)
      }
    } catch (error) {
      console.error('❌ SMTP.js email failed:', error)
      return { success: false, error: error.message }
    }
  },

  async loadSmtpJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://smtpjs.com/v3/smtp.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

// Option 4: Netlify Forms (if hosted on Netlify)
export const netlifyFormsService = {
  async sendEmail(templateParams) {
    try {
      const formData = new FormData()
      formData.append('form-name', 'skillforge-contact')
      formData.append('email', templateParams.to_email)
      formData.append('name', templateParams.to_name)
      formData.append('subject', templateParams.subject)
      formData.append('message', templateParams.message)

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        console.log('✅ Netlify Forms email sent successfully')
        return { success: true, response: 'Email queued' }
      } else {
        throw new Error('Netlify Forms request failed')
      }
    } catch (error) {
      console.error('❌ Netlify Forms email failed:', error)
      return { success: false, error: error.message }
    }
  }
}