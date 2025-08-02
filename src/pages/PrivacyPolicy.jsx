import { motion } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Introduction</h2>
          <p>
            DevChain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based learning milestone tracker.
          </p>

          <h2>Information We Collect</h2>
          <h3>Blockchain Data</h3>
          <ul>
            <li>Learning milestone entries stored as transaction memos on Hedera</li>
            <li>NFT badge ownership records</li>
            <li>Wallet addresses and transaction hashes</li>
          </ul>

          <h3>Optional Profile Information</h3>
          <ul>
            <li>Display name and bio</li>
            <li>Social media links (GitHub, Twitter, LinkedIn)</li>
            <li>Website URL</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To display your learning progress and achievements</li>
            <li>To mint and manage NFT badges</li>
            <li>To improve our platform and user experience</li>
          </ul>

          <h2>Blockchain Transparency</h2>
          <p>
            Please note that information stored on the Hedera blockchain is public and immutable. This includes:
          </p>
          <ul>
            <li>Learning milestone titles and descriptions</li>
            <li>Dates and categories of learning entries</li>
            <li>Badge ownership and minting transactions</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account (note: blockchain data cannot be deleted)</li>
            <li>Export your data</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@devchain.dev
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export default PrivacyPolicy