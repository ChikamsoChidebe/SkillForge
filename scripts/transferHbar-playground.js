import { Client, AccountId, PrivateKey, TransferTransaction, Hbar } from "@hashgraph/sdk";

// Hard-coded credentials for Hedera Playground (do not commit to GitHub)
const operatorId = AccountId.fromString("0.0.6478142");
const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204201d38847744d48683b3ce6da76147d482005b4ac992f002ef9b62fcc24e5c1f7e");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // Use your own account ID as the recipient for a test transfer
  const RECEIVER_ID = AccountId.fromString("0.0.6478142");

  const tx = await new TransferTransaction()
    .addHbarTransfer(operatorId, new Hbar(-1))
    .addHbarTransfer(RECEIVER_ID, new Hbar(1))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("Transaction status:", receipt.status.toString());
}

main();
