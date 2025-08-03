exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { to_email, subject, message } = JSON.parse(event.body)
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'RESEND_API_KEY environment variable not set' 
        })
      }
    }
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SkillForge <onboarding@resend.dev>',
        to: [to_email],
        subject: subject,
        html: message
      })
    })

    const result = await response.json()

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: result.id })
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: result.message || 'Email sending failed' })
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    }
  }
}