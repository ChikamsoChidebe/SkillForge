import Groq from 'groq-sdk'

class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    })
  }

  async generateLearningInsights(entries) {
    try {
      const entriesText = entries.map(entry => 
        `${entry.title} (${entry.category}): ${entry.description}`
      ).join('\n')

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an AI learning coach that analyzes learning entries and provides personalized insights, recommendations, and skill gap analysis. Be encouraging and specific."
          },
          {
            role: "user",
            content: `Analyze these learning entries and provide insights:\n\n${entriesText}\n\nProvide:\n1. Key learning patterns\n2. Skill progression analysis\n3. Recommended next steps\n4. Areas for improvement`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1000
      })

      return completion.choices[0]?.message?.content || "Unable to generate insights at this time."
    } catch (error) {
      console.error('Groq API error:', error)
      throw new Error('Failed to generate learning insights')
    }
  }

  async generateEntryDescription(title, category) {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates concise, professional descriptions for learning entries. Keep responses under 100 words and focus on key learning outcomes."
          },
          {
            role: "user",
            content: `Generate a description for this learning entry:\nTitle: ${title}\nCategory: ${category}`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.6,
        max_tokens: 150
      })

      return completion.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Groq API error:', error)
      return ""
    }
  }

  async generateSkillRecommendations(userProfile, entries) {
    try {
      const profileText = `User focuses on: ${Object.keys(userProfile.categoryStats || {}).join(', ')}`
      const recentEntries = entries.slice(-5).map(e => e.title).join(', ')

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a career advisor AI that recommends relevant skills and learning paths based on a user's learning history. Provide 5 specific, actionable recommendations."
          },
          {
            role: "user",
            content: `Based on this learning profile:\n${profileText}\n\nRecent entries: ${recentEntries}\n\nRecommend 5 skills or topics they should learn next to advance their career.`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.8,
        max_tokens: 500
      })

      return completion.choices[0]?.message?.content || "Unable to generate recommendations at this time."
    } catch (error) {
      console.error('Groq API error:', error)
      throw new Error('Failed to generate skill recommendations')
    }
  }

  async generateBadgeDescription(badgeName, criteria) {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a creative writer that generates inspiring, motivational descriptions for achievement badges. Keep it under 50 words and make it sound prestigious."
          },
          {
            role: "user",
            content: `Create a description for the "${badgeName}" badge. Criteria: ${criteria}`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.9,
        max_tokens: 100
      })

      return completion.choices[0]?.message?.content || ""
    } catch (error) {
      console.error('Groq API error:', error)
      return ""
    }
  }

  async chatWithAI(message, context = "") {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are DevChain AI, a helpful learning assistant for a blockchain-based learning platform. You help users with learning advice, skill development, and career guidance. Context: ${context}`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 800
      })

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request right now."
    } catch (error) {
      console.error('Groq API error:', error)
      throw new Error('Failed to get AI response')
    }
  }
}

export const groqService = new GroqService()