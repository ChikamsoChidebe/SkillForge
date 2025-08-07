import { 
  Client, 
  PrivateKey, 
  AccountId, 
  ContractCreateTransaction, 
  ContractExecuteTransaction,
  ContractCallQuery,
  FileCreateTransaction,
  Hbar,
  ContractFunctionParameters
} from '@hashgraph/sdk'

class AdvancedHederaClient {
  constructor() {
    this.client = Client.forTestnet()
    this.operatorId = AccountId.fromString(import.meta.env.VITE_HEDERA_ACCOUNT_ID)
    this.operatorKey = PrivateKey.fromStringDER(import.meta.env.VITE_HEDERA_PRIVATE_KEY)
    
    this.client.setOperator(this.operatorId, this.operatorKey)
    this.contractId = null
  }

  async deployContract(bytecode) {
    try {
      // Upload contract bytecode to Hedera File Service
      const fileCreateTx = new FileCreateTransaction()
        .setContents(bytecode)
        .setKeys([this.operatorKey])
        .setMaxTransactionFee(new Hbar(2))

      const fileCreateSubmit = await fileCreateTx.execute(this.client)
      const fileCreateRx = await fileCreateSubmit.getReceipt(this.client)
      const bytecodeFileId = fileCreateRx.fileId

      // Deploy contract
      const contractCreateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setConstructorParameters(new ContractFunctionParameters())

      const contractCreateSubmit = await contractCreateTx.execute(this.client)
      const contractCreateRx = await contractCreateSubmit.getReceipt(this.client)
      
      this.contractId = contractCreateRx.contractId
      
      return {
        success: true,
        contractId: this.contractId.toString(),
        transactionId: contractCreateSubmit.transactionId.toString()
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async recordLearningOnContract(title, description, category) {
    if (!this.contractId) {
      throw new Error('Contract not deployed')
    }

    try {
      const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction('recordLearning', 
          new ContractFunctionParameters()
            .addString(title)
            .addString(description)
            .addString(category)
        )

      const contractExecuteSubmit = await contractExecuteTx.execute(this.client)
      const contractExecuteRx = await contractExecuteSubmit.getReceipt(this.client)

      return {
        success: true,
        transactionId: contractExecuteSubmit.transactionId.toString(),
        status: contractExecuteRx.status.toString()
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getUserBadges(userAddress) {
    if (!this.contractId) {
      throw new Error('Contract not deployed')
    }

    try {
      const contractCallQuery = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction('getUserBadges', 
          new ContractFunctionParameters().addAddress(userAddress)
        )

      const contractCallResult = await contractCallQuery.execute(this.client)
      const badges = contractCallResult.getUint256Array(0)

      return {
        success: true,
        badges: badges.map(badge => badge.toString())
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getLearningRecords(userAddress) {
    if (!this.contractId) {
      throw new Error('Contract not deployed')
    }

    try {
      const contractCallQuery = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction('getLearningRecords', 
          new ContractFunctionParameters().addAddress(userAddress)
        )

      const contractCallResult = await contractCallQuery.execute(this.client)
      
      return {
        success: true,
        records: contractCallResult
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async verifyEducator(educatorAddress) {
    if (!this.contractId) {
      throw new Error('Contract not deployed')
    }

    try {
      const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction('verifyEducator', 
          new ContractFunctionParameters().addAddress(educatorAddress)
        )

      const contractExecuteSubmit = await contractExecuteTx.execute(this.client)
      const contractExecuteRx = await contractExecuteSubmit.getReceipt(this.client)

      return {
        success: true,
        transactionId: contractExecuteSubmit.transactionId.toString(),
        status: contractExecuteRx.status.toString()
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export const advancedHederaClient = new AdvancedHederaClient()