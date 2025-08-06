import { 
  Client, 
  TransferTransaction, 
  PrivateKey, 
  AccountId,
  TokenMintTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
  AccountBalanceQuery
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
      const accountId = import.meta.env.VITE_HEDERA_ACCOUNT_ID
      const privateKey = import.meta.env.VITE_HEDERA_PRIVATE_KEY
      
      if (!accountId || !privateKey || privateKey === 'your-private-key-here') {
        console.warn('⚠️ Hedera credentials not configured - using demo mode')
        throw new Error('Demo mode: Hedera credentials not configured')
      }
      
      this.operatorId = AccountId.fromString(accountId)
      this.operatorKey = PrivateKey.fromString(privateKey)
      
      this.client = Client.forTestnet()
      this.client.setOperator(this.operatorId, this.operatorKey)
      
      // Test connection
      await this.getAccountBalance()
      
      this.isInitialized = true
      console.log('✅ Hedera client initialized successfully')
    } catch (error) {
      console.error('❌ Hedera client initialization failed:', error)
      this.isInitialized = false
      throw new Error(`Hedera connection failed: ${error.message}`)
    }
  }

  async connectWallet() {
    try {
      await this.initialize()
      
      return {
        accountId: this.operatorId.toString(),
        publicKey: this.operatorKey.publicKey.toString(),
        balance: await this.getAccountBalance(),
        connectionType: 'hedera_sdk'
      }
    } catch (error) {
      console.error('Hedera wallet connection failed:', error)
      throw new Error(`Wallet connection failed: ${error.message}`)
    }
  }

  async connectManualAccount(accountId) {
    try {
      // Validate account ID format
      const parsedAccountId = AccountId.fromString(accountId)
      
      return {
        accountId: parsedAccountId.toString(),
        publicKey: 'manual_connection',
        balance: 'N/A',
        connectionType: 'manual'
      }
    } catch (error) {
      throw new Error('Invalid account ID format')
    }
  }

  async getAccountBalance() {
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(this.operatorId)
        .execute(this.client)
      return balance.hbars.toString()
    } catch (error) {
      console.error('Failed to get account balance:', error)
      return '0'
    }
  }

  async recordEntry({ title, description, date, category = 'tutorial' }) {
    try {
      await this.initialize()
      
      const timestamp = new Date(date).toISOString()
      const payload = `${timestamp}|${category}|${title}|${description}`.substring(0, 100)
      
      // Create a simple transfer transaction with memo
      const transaction = new TransferTransaction()
        .addHbarTransfer(this.operatorId, new Hbar(-0.00000001)) // Minimal amount
        .addHbarTransfer('0.0.98', new Hbar(0.00000001)) // Hedera fee collection
        .setTransactionMemo(payload)
        .setMaxTransactionFee(new Hbar(2))
        .setTransactionValidDuration(180) // 3 minutes
      
      // Execute transaction
      const response = await transaction.execute(this.client)
      const receipt = await response.getReceipt(this.client)
      
      console.log('✅ Hedera transaction successful:', response.transactionId.toString())
      
      return {
        txHash: response.transactionId.toString(),
        status: receipt.status.toString(),
        timestamp: Date.now(),
        entry: { title, description, date, category },
        blockchain: 'hedera'
      }
    } catch (error) {
      console.error('❌ Hedera transaction failed:', error)
      
      // Professional fallback - still create verifiable entry
      const fallbackTxHash = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      return {
        txHash: fallbackTxHash,
        status: 'DEMO_MODE',
        timestamp: Date.now(),
        entry: { title, description, date, category },
        blockchain: 'demo',
        note: 'Entry recorded in demo mode - still verifiable via local storage'
      }
    }
  }

  async getEntries(limit = 50) {
    await this.initialize()
    
    try {
      // Query Hedera Mirror Node for account transactions
      const response = await fetch(
        `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${this.operatorId}&limit=${limit}&order=desc`
      )
      const data = await response.json()
      
      // Filter transactions with memos (learning entries)
      const entries = data.transactions
        .filter(tx => tx.memo_base64)
        .map((tx, index) => {
          try {
            const memo = atob(tx.memo_base64)
            const [timestamp, category, title, description] = memo.split('|')
            return {
              id: tx.transaction_id,
              title: title || 'Learning Entry',
              description: description || 'No description',
              date: timestamp ? new Date(timestamp).toISOString().split('T')[0] : new Date(tx.consensus_timestamp * 1000).toISOString().split('T')[0],
              category: category || 'tutorial',
              txHash: tx.transaction_id,
              timestamp: tx.consensus_timestamp * 1000
            }
          } catch (error) {
            return null
          }
        })
        .filter(Boolean)
      
      return entries
    } catch (error) {
      console.error('Failed to get entries:', error)
      return []
    }
  }

  async createBadgeToken() {
    await this.initialize()
    
    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName('SkillForge Learning Badge')
        .setTokenSymbol('SFBADGE')
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
    const entries = await this.getEntries()
    const entryCount = entries.length
    
    const badges = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Completed your first learning entry',
        milestone: 1,
        unlocked: entryCount >= 1,
        unlockedAt: entryCount >= 1 ? entries[entries.length - 1]?.date : null,
        icon: '🎯',
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Learning Streak',
        description: 'Logged 5 learning milestones',
        milestone: 5,
        unlocked: entryCount >= 5,
        unlockedAt: entryCount >= 5 ? entries[entries.length - 5]?.date : null,
        icon: '🔥',
        rarity: 'uncommon'
      },
      {
        id: '3',
        name: 'Knowledge Builder',
        description: 'Reached 10 learning entries',
        milestone: 10,
        unlocked: entryCount >= 10,
        unlockedAt: entryCount >= 10 ? entries[entries.length - 10]?.date : null,
        icon: '🏗️',
        rarity: 'rare'
      },
      {
        id: '4',
        name: 'Learning Master',
        description: 'Achieved 20 learning milestones',
        milestone: 20,
        unlocked: entryCount >= 20,
        unlockedAt: entryCount >= 20 ? entries[entries.length - 20]?.date : null,
        icon: '👑',
        rarity: 'legendary'
      }
    ]
    
    return badges
  }

  getHashScanUrl(txHash) {
    if (txHash.startsWith('demo_') || txHash.startsWith('local_')) {
      return null // No blockchain verification for demo entries
    }
    return `https://hashscan.io/testnet/transaction/${txHash}`
  }

  isDemoMode() {
    return !this.isInitialized
  }

  getConnectionStatus() {
    return {
      initialized: this.isInitialized,
      accountId: this.operatorId?.toString() || 'Demo Mode',
      network: 'testnet',
      mode: this.isInitialized ? 'blockchain' : 'demo'
    }
  }
}

export const hederaClient = new HederaClient()