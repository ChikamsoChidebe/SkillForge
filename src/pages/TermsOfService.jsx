import { motion } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const TermsOfService = () => {
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
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using DevChain, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>Description of Service</h2>
          <p>
            DevChain is a blockchain-based platform that allows users to record learning milestones and earn verifiable NFT badges on the Hedera network.
          </p>

          <h2>User Responsibilities</h2>
          <ul>
            <li>Provide accurate and truthful learning milestone information</li>
            <li>Maintain the security of your wallet and private keys</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect intellectual property rights</li>
          </ul>

          <h2>Blockchain Considerations</h2>
          <ul>
            <li>All transactions are final and immutable once recorded on Hedera</li>
            <li>You are responsible for transaction fees</li>
            <li>Blockchain data is publicly accessible</li>
            <li>We cannot reverse or modify blockchain transactions</li>
          </ul>

          <h2>Prohibited Uses</h2>
          <p>You may not use DevChain to:</p>
          <ul>
            <li>Submit false or misleading learning information</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on others' intellectual property</li>
            <li>Attempt to manipulate or exploit the platform</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            DevChain shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
          </p>

          <h2>Contact Information</h2>
          <p>
            For questions about these Terms of Service, contact us at:
            <br />
            Email: legal@devchain.dev
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export default TermsOfService