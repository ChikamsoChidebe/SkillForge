import { Client, AccountId, PrivateKey, TransferTransaction, Hbar } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

// Use environment variables for credentials
const operatorId = AccountId.fromString(process.env.VITE_HEDERA_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.VITE_HEDERA_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // Replace with the recipient's Hedera Account ID
  const RECEIVER_ID = AccountId.fromString("0.0.6480000");

  const tx = await new TransferTransaction()
    .addHbarTransfer(operatorId, new Hbar(-1))
    .addHbarTransfer(RECEIVER_ID, new Hbar(1))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("Transaction status:", receipt.status.toString());
}

main();
