import { ethers } from "ethers";
import { MON_LOYALTY_ABI, MON_LOYALTY_BYTECODE } from "../contracts/MonLoyalty.js";

class MonadService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.enabled = false;
    }

    init() {
        const rpcUrl = process.env.MONAD_RPC_URL;
        const privateKey = process.env.MONAD_PRIVATE_KEY;
        const contractAddress = process.env.MONAD_CONTRACT_ADDRESS;

        if (!rpcUrl || !privateKey || !contractAddress) {
            console.warn(
                "[monadService] ⚠️ Env vars missing — on-chain settlement DISABLED."
            );
            this.enabled = false;
            return;
        }

        try {
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            this.signer = new ethers.Wallet(privateKey, this.provider);
            this.contract = new ethers.Contract(contractAddress, MON_LOYALTY_ABI, this.signer);
            this.enabled = true;
            console.log("[monadService] ✅ Monad on-chain settlement ENABLED");
        } catch (err) {
            console.error("[monadService] ❌ Initialization failed:", err.message);
            this.enabled = false;
        }
    }

    async settle(walletAddress, amount, userId) {
        if (!this.enabled || !this.contract) {
            throw new Error("Monad service is not enabled");
        }

        try {
            console.log(`[monadService] Settling ${amount} MON to ${walletAddress}...`);
            const amountWei = ethers.parseEther(amount.toString());
            const tx = await this.contract.settle(walletAddress, amountWei, userId);
            const receipt = await tx.wait();

            console.log(`[monadService] ✅ Transaction successful: ${receipt.hash}`);
            return {
                txHash: receipt.hash,
                blockNumber: receipt.blockNumber
            };
        } catch (err) {
            console.error("[monadService] ❌ Settlement failed:", err.message);
            throw err;
        }
    }

    async deploy() {
        const rpcUrl = process.env.MONAD_RPC_URL;
        const privateKey = process.env.MONAD_PRIVATE_KEY;

        if (!rpcUrl || !privateKey) {
            throw new Error("MONAD_RPC_URL and MONAD_PRIVATE_KEY required for deployment");
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const signer = new ethers.Wallet(privateKey, provider);
        const factory = new ethers.ContractFactory(MON_LOYALTY_ABI, MON_LOYALTY_BYTECODE, signer);

        console.log("[monadService] Deploying MonLoyalty contract...");
        const contract = await factory.deploy();
        await contract.waitForDeployment();
        const address = await contract.getAddress();

        console.log(`[monadService] ✅ Contract deployed at: ${address}`);
        return address;
    }
}

export const monadService = new MonadService();
