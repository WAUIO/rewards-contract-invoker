export const networks: {[key: string]: any} = {
    private: {
        /* rpcUrl: "http://localhost:50012",
        reward_contract_script_hash: "xxxxxxxxxxxxxxxxxxxxxxx",
        owner_address: "xxxxxxxxxxxxxxxxxxxxxx",
        owner_private_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxx" */
    },
    testnet: {
        rpcUrl: process.env.RPC_URL,
        reward_contract_script_hash: process.env.REWARD_CONTRACT_SCRIPT_HASH,
        owner_address: process.env.REWARD_CONTRACT_OWNER_ADDRESS,
        owner_private_key: process.env.REWARD_CONTRACT_OWNER_PRIVATE_KEY
    }
}