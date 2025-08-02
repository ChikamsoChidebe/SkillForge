import { 
  Client, 
  TransferTransaction, 
  PrivateKey, 
  AccountId,
  TokenMintTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar
} from '@hashgraph/sdk'

class HederaClient {
  constructor() {
    this.client = null
    this.operatorId = null
    this.operatorKey = null
    this.badgeTokenId = null
    this.isInitialized = false
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // For demo purposes - in production, use environment variables or secure wallet connection
      this.operatorId = AccountId.fromString(import.meta.env.VITE_HEDERA_ACCOUNT_ID || '0.0.4707393')
      this.operatorKey = PrivateKey.fromString(import.meta.env.VITE_HEDERA_PRIVATE_KEY || 'your-private-key-here')
      
      this.client = Client.forTestnet()
      this.client.setOperator(this.operatorId, this.operatorKey)
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Hedera client:', error)
      throw new Error('Hedera client initialization failed')
    }
  }

  async connectWallet() {
    await this.initialize()
    
    // Simulate wallet connection - in production, integrate with HashPack or other wallets
    return {
      accountId: this.operatorId.toString(),
      publicKey: this.operatorKey.publicKey.toString(),
      balance: await this.getAccountBalance(),
    }
  }

  async getAccountBalance() {
    try {
      const balance = await this.client.getAccountBalance(this.operatorId)
      return balance.hbars.toString()
    } catch (error) {
      console.error('Failed to get account balance:', error)
      return '0'
    }
  }

  async recordEntry({ title, description, date, category = 'tutorial' }) {
    await this.initialize()
    
    try {
      const timestamp = new Date(date).toISOString()
      const payload = `${timestamp}|${category}|${title}|${description}`.substring(0, 100)
      
      const transaction = new TransferTransaction()
        .addHbarTransfer(this.operatorId, new Hbar(-0.001))
        .addHbarTransfer(this.operatorId, new Hbar(0.001))
        .setTransactionMemo(payload)
        .freezeWith(this.client)

      const signedTx = await transaction.sign(this.operatorKey)
      const response = await signedTx.execute(this.client)
      const receipt = await response.getReceipt(this.client)
      
      return {
        txHash: response.transactionId.toString(),
        status: receipt.status.toString(),
        timestamp: Date.now(),
        entry: { title, description, date, category }
      }
    } catch (error) {
      console.error('Failed to record entry:', error)
      throw new Error(`Failed to record entry: ${error.message}`)
    }
  }

  async getEntries(limit = 50) {
    await this.initialize()
    
    try {
      // In a real implementation, you would query the Hedera network for transactions
      // For demo purposes, return mock data
      const mockEntries = [
        {
          id: '1',
          title: 'React Hooks Deep Dive',
          description: 'Learned about useState, useEffect, and custom hooks',
          date: '2024-01-15',
          category: 'tutorial',
          txHash: '0.0.4707393@1705123456.123456789',
          timestamp: 1705123456789
        },
        {
          id: '2',
          title: 'Hedera SDK Integration',
          description: 'Successfully integrated Hedera SDK for blockchain transactions',
          date: '2024-01-14',
          category: 'project',
          txHash: '0.0.4707393@1705037056.123456789',
          timestamp: 1705037056789
        }
      ]
      
      return mockEntries.slice(0, limit)
    } catch (error) {
      console.error('Failed to get entries:', error)
      return []
    }
  }

  async createBadgeToken() {
    await this.initialize()
    
    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName('DevChain Learning Badge')
        .setTokenSymbol('DCBADGE')
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1000)
        .setTreasuryAccountId(this.operatorId)
        .setSupplyKey(this.operatorKey)
        .freezeWith(this.client)

      const signedTx = await transaction.sign(this.operatorKey)
      const response = await signedTx.execute(this.client)
      const receipt = await response.getReceipt(this.client)
      
      this.badgeTokenId = receipt.tokenId
      return receipt.tokenId.toString()
    } catch (error) {
      console.error('Failed to create badge token:', error)
      throw new Error(`Failed to create badge token: ${error.message}`)
    }
  }

  async mintBadge(milestone, metadata) {
    await this.initialize()
    
    if (!this.badgeTokenId) {
      await this.createBadgeToken()
    }

    try {
      const transaction = new TokenMintTransaction()
        .setTokenId(this.badgeTokenId)
        .setMetadata([Buffer.from(JSON.stringify({ milestone, ...metadata }))])
        .freezeWith(this.client)

      const signedTx = await transaction.sign(this.operatorKey)
      const response = await signedTx.execute(this.client)
      const receipt = await response.getReceipt(this.client)
      
      return {
        tokenId: this.badgeTokenId.toString(),
        serialNumber: receipt.serials[0].toString(),
        txHash: response.transactionId.toString(),
        milestone,
        metadata
      }
    } catch (error) {
      console.error('Failed to mint badge:', error)
      throw new Error(`Failed to mint badge: ${error.message}`)
    }
  }

  async getBadges() {
    // Mock badge data for demo
    return [
      {
        id: '1',
        name: 'First Steps',
        description: 'Completed your first learning entry',
        milestone: 1,
        unlocked: true,
        unlockedAt: '2024-01-15',
        icon: '🎯',
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Learning Streak',
        description: 'Logged 5 learning milestones',
        milestone: 5,
        unlocked: false,
        icon: '🔥',
        rarity: 'uncommon'
      },
      {
        id: '3',
        name: 'Knowledge Builder',
        description: 'Reached 10 learning entries',
        milestone: 10,
        unlocked: false,
        icon: '🏗️',
        rarity: 'rare'
      },
      {
        id: '4',
        name: 'Learning Master',
        description: 'Achieved 20 learning milestones',
        milestone: 20,
        unlocked: false,
        icon: '👑',
        rarity: 'legendary'
      }
    ]
  }

  getHashScanUrl(txHash) {
    return `https://hashscan.io/testnet/transaction/${txHash}`
  }
}

export const hederaClient = new HederaClient()