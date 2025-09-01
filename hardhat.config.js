require("dotenv/config")
require("@nomicfoundation/hardhat-toolbox")

module.exports = {
    solidity: "0.8.20",
    network: {
        irys: {
            url: "https://testnet-rpc.irys.xyz/v1/execution-rpc",
            chainId: 1270,
            accounts: process.env.PRIVATE_KEY
        }
    }
}