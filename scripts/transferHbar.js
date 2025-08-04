import { Client, AccountId, PrivateKey, TransferTransaction, Hbar } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();



// Debug: Print env variables to help diagnose issues
console.log('Loaded HEDERA_ACCOUNT_ID:', process.env.HEDERA_ACCOUNT_ID);
console.log('Loaded HEDERA_PRIVATE_KEY:', process.env.HEDERA_PRIVATE_KEY);

if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
  throw new Error('Missing Hedera credentials in .env file. Please check HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY.');
}

const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // Use your own account ID as the recipient for a test transfer
  const RECEIVER_ID = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);

  const tx = await new TransferTransaction()
    .addHbarTransfer(operatorId, new Hbar(-1))
    .addHbarTransfer(RECEIVER_ID, new Hbar(1))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("Transaction status:", receipt.status.toString());
}

main();
