import { monadService } from "./src/services/monadService.js";
import "dotenv/config";

async function run() {
    console.log("🚀 Starting MonLoyalty contract deployment...");
    try {
        const address = await monadService.deploy();
        console.log("\n--- DEPLOYMENT SUCCESSFUL ---");
        console.log(`CONTRACT ADDRESS: ${address}`);
        console.log("-----------------------------\n");
        console.log("Next steps:");
        console.log(`1. Add MONAD_CONTRACT_ADDRESS="${address}" to your .env file`);
        console.log("2. Restart the backend server");
    } catch (err) {
        console.error("\n❌ Deployment failed:", err.message);
        if (err.message.includes("no MON")) {
            console.log("💡 Tip: Get some MON from the faucet at https://testnet.monad.xyz/faucet");
        }
    }
}

run();
