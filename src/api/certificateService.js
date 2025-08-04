import { supabase } from './supabaseClient'
import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenMintTransaction, TokenType, TokenSupplyType, Hbar } from '@hashgraph/sdk'

// Hedera client setup
const client = Client.forTestnet()
const operatorId = AccountId.fromString(import.meta.env.VITE_HEDERA_ACCOUNT_ID)
const operatorKey = PrivateKey.fromString(import.meta.env.VITE_HEDERA_PRIVATE_KEY)
client.setOperator(operatorId, operatorKey)

// Certificate templates
const CERTIFICATE_TEMPLATES = {
  course_completion: {
    name: 'Course Completion Certificate',
    description: 'Certificate awarded for completing a SkillForge course',
    image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
    attributes: ['Course Title', 'Completion Date', 'Final Score', 'Duration']
  },
  workshop_attendance: {
    name: 'Workshop Attendance Certificate',
    description: 'Certificate awarded for attending a SkillForge workshop',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    attributes: ['Workshop Title', 'Date', 'Instructor', 'Duration']
  },
  skill_mastery: {
    name: 'Skill Mastery Certificate',
    description: 'Certificate awarded for mastering a specific skill area',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    attributes: ['Skill Area', 'Level', 'Courses Completed', 'Achievement Date']
  },
  learning_streak: {
    name: 'Learning Streak Certificate',
    description: 'Certificate awarded for consistent learning activity',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    attributes: ['Streak Days', 'Start Date', 'End Date', 'Activities Completed']
  }
}

class CertificateService {
  // Generate certificate for course completion
  async generateCourseCompletionCertificate(userId, courseId, courseTitle, completionData) {
    try {
      const certificateData = {
        type: 'course_completion',
        userId,
        courseId,
        courseTitle,
        completionDate: new Date().toISOString(),
        finalScore: completionData.finalScore || 0,
        duration: completionData.duration || '0 hours',
        template: CERTIFICATE_TEMPLATES.course_completion
      }

      // Create certificate record in database
      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          type: 'course_completion',
          title: `${courseTitle} - Completion Certificate`,
          description: `Certificate of completion for ${courseTitle}`,
          metadata: certificateData,
          issued_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Mint NFT certificate on Hedera (simplified for demo)
      try {
        const nftData = await this.mintCertificateNFT(certificate.id, certificateData)
        
        // Update certificate with NFT data
        await supabase
          .from('certificates')
          .update({
            nft_token_id: nftData.tokenId,
            nft_serial_number: nftData.serialNumber,
            blockchain_hash: nftData.transactionId,
            status: 'issued'
          })
          .eq('id', certificate.id)

        return { ...certificate, nft: nftData }
      } catch (nftError) {
        console.error('NFT minting failed:', nftError)
        // Certificate still created in database even if NFT fails
        return certificate
      }
    } catch (error) {
      console.error('Error generating course completion certificate:', error)
      throw error
    }
  }

  // Generate certificate for workshop attendance
  async generateWorkshopCertificate(userId, workshopId, workshopTitle, attendanceData) {
    try {
      const certificateData = {
        type: 'workshop_attendance',
        userId,
        workshopId,
        workshopTitle,
        attendanceDate: attendanceData.date,
        instructor: attendanceData.instructor,
        duration: attendanceData.duration,
        template: CERTIFICATE_TEMPLATES.workshop_attendance
      }

      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          type: 'workshop_attendance',
          title: `${workshopTitle} - Attendance Certificate`,
          description: `Certificate of attendance for ${workshopTitle}`,
          metadata: certificateData,
          issued_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      try {
        const nftData = await this.mintCertificateNFT(certificate.id, certificateData)
        
        await supabase
          .from('certificates')
          .update({
            nft_token_id: nftData.tokenId,
            nft_serial_number: nftData.serialNumber,
            blockchain_hash: nftData.transactionId,
            status: 'issued'
          })
          .eq('id', certificate.id)

        return { ...certificate, nft: nftData }
      } catch (nftError) {
        console.error('NFT minting failed:', nftError)
        return certificate
      }
    } catch (error) {
      console.error('Error generating workshop certificate:', error)
      throw error
    }
  }

  // Generate skill mastery certificate
  async generateSkillMasteryCertificate(userId, skillArea, level, coursesCompleted) {
    try {
      const certificateData = {
        type: 'skill_mastery',
        userId,
        skillArea,
        level,
        coursesCompleted,
        achievementDate: new Date().toISOString(),
        template: CERTIFICATE_TEMPLATES.skill_mastery
      }

      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          type: 'skill_mastery',
          title: `${skillArea} ${level} Mastery Certificate`,
          description: `Certificate of ${level} mastery in ${skillArea}`,
          metadata: certificateData,
          issued_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      try {
        const nftData = await this.mintCertificateNFT(certificate.id, certificateData)
        
        await supabase
          .from('certificates')
          .update({
            nft_token_id: nftData.tokenId,
            nft_serial_number: nftData.serialNumber,
            blockchain_hash: nftData.transactionId,
            status: 'issued'
          })
          .eq('id', certificate.id)

        return { ...certificate, nft: nftData }
      } catch (nftError) {
        console.error('NFT minting failed:', nftError)
        return certificate
      }
    } catch (error) {
      console.error('Error generating skill mastery certificate:', error)
      throw error
    }
  }

  // Mint NFT certificate on Hedera
  async mintCertificateNFT(certificateId, certificateData) {
    try {
      // Create NFT token (simplified - in production, you'd have pre-created tokens)
      const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName(`SkillForge Certificate #${certificateId}`)
        .setTokenSymbol('SFCERT')
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1)
        .setTreasuryAccountId(operatorId)
        .setSupplyKey(operatorKey)
        .setMaxTransactionFee(new Hbar(10))

      const tokenCreateSubmit = await tokenCreateTx.execute(client)
      const tokenCreateReceipt = await tokenCreateSubmit.getReceipt(client)
      const tokenId = tokenCreateReceipt.tokenId

      // Mint the NFT
      const metadata = JSON.stringify({
        name: certificateData.template.name,
        description: certificateData.template.description,
        image: certificateData.template.image,
        attributes: certificateData,
        issuer: 'SkillForge Learning Platform',
        issued_at: new Date().toISOString()
      })

      const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadata)])
        .setMaxTransactionFee(new Hbar(10))

      const mintSubmit = await mintTx.execute(client)
      const mintReceipt = await mintSubmit.getReceipt(client)

      return {
        tokenId: tokenId.toString(),
        serialNumber: mintReceipt.serials[0].toString(),
        transactionId: mintSubmit.transactionId.toString(),
        metadata
      }
    } catch (error) {
      console.error('Error minting NFT certificate:', error)
      throw error
    }
  }

  // Get user's certificates
  async getUserCertificates(userId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .order('issued_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching user certificates:', error)
      throw error
    }
  }

  // Verify certificate authenticity
  async verifyCertificate(certificateId) {
    try {
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateId)
        .single()

      if (error) throw error

      if (!certificate) {
        return { valid: false, reason: 'Certificate not found' }
      }

      // Additional verification logic could be added here
      // e.g., checking blockchain transaction, NFT ownership, etc.

      return {
        valid: true,
        certificate,
        blockchainVerified: !!certificate.blockchain_hash,
        nftExists: !!certificate.nft_token_id
      }
    } catch (error) {
      console.error('Error verifying certificate:', error)
      return { valid: false, reason: 'Verification failed' }
    }
  }

  // Get certificate by ID
  async getCertificateById(certificateId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateId)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching certificate:', error)
      throw error
    }
  }

  // Generate certificate image/PDF (placeholder)
  generateCertificateImage(certificateData) {
    // In a real implementation, this would generate a PDF or image
    // using libraries like jsPDF, canvas, or server-side image generation
    return {
      imageUrl: certificateData.template.image,
      pdfUrl: null, // Would be generated
      shareableUrl: `${window.location.origin}/certificates/${certificateData.id}`
    }
  }

  // Get certificate statistics
  async getCertificateStats(userId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('type')
        .eq('user_id', userId)

      if (error) throw error

      const stats = {
        total: data.length,
        byType: data.reduce((acc, cert) => {
          acc[cert.type] = (acc[cert.type] || 0) + 1
          return acc
        }, {}),
        recent: data.slice(-5) // Last 5 certificates
      }

      return stats
    } catch (error) {
      console.error('Error fetching certificate stats:', error)
      throw error
    }
  }

  // Check if user qualifies for skill mastery certificate
  async checkSkillMasteryEligibility(userId, skillArea) {
    try {
      // Get user's completed courses in skill area
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select('*, course_id')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (error) throw error

      // Filter by skill area (this would need course category mapping)
      const skillCourses = enrollments.filter(enrollment => {
        // This is simplified - you'd need proper course-to-skill mapping
        return enrollment.course_id.includes(skillArea.toLowerCase())
      })

      const requirements = {
        beginner: 1,
        intermediate: 3,
        advanced: 5
      }

      let qualifiedLevel = null
      if (skillCourses.length >= requirements.advanced) {
        qualifiedLevel = 'advanced'
      } else if (skillCourses.length >= requirements.intermediate) {
        qualifiedLevel = 'intermediate'
      } else if (skillCourses.length >= requirements.beginner) {
        qualifiedLevel = 'beginner'
      }

      return {
        qualified: !!qualifiedLevel,
        level: qualifiedLevel,
        coursesCompleted: skillCourses.length,
        requirements
      }
    } catch (error) {
      console.error('Error checking skill mastery eligibility:', error)
      throw error
    }
  }
}

export const certificateService = new CertificateService()