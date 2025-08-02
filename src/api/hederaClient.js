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
      const accountId = import.meta.env.VITE_HEDERA_ACCOUNT_ID
      const privateKey = import.meta.env.VITE_HEDERA_PRIVATE_KEY
      
      // Check if environment variables are properly set
      if (!accountId || !privateKey || privateKey === 'your-private-key-here') {
        throw new Error('Hedera credentials not configured. Please set VITE_HEDERA_ACCOUNT_ID and VITE_HEDERA_PRIVATE_KEY in .env.local')
      }
      
      this.operatorId = AccountId.fromString(accountId)
      this.operatorKey = PrivateKey.fromString(privateKey)
      
      this.client = Client.forTestnet()
      this.client.setOperator(this.operatorId, this.operatorKey)
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize Hedera client:', error)
      throw new Error(`Hedera client initialization failed: ${error.message}`)
    }
  }

  async connectWallet() {
    await this.initialize()
    
    // Real Hedera connection
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
    return `https://hashscan.io/testnet/transaction/${txHash}`
  }
}

export const hederaClient = new HederaClient()