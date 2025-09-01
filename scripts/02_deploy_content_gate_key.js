import "dotenv/config"
import hre from "hardhat"

async function deployDataKey() {
    const tokenAddr = process.env.TOKEN_ADDRESS;
    const dataID = process.env.DATA_ID;
    const accessKeyHex = process.env.ACCESS_KEY;
    const minBalanceStr = process.env.MIN_BALANCE;

    if (!tokenAddr || !dataID || !accessKeyHex) throw new Error("Set TOKEN_ADDRESS, DATA_ID, AES_KEY in .env")

    const minBalance = hre.ethers.parseUnits(minBalanceStr, 18);
    const accessKeyBytes = hre.ethers.getBytes("0x" + accessKeyHex.replace(/^0x/, ""))

    const DataGateKey = await hre.ethers.getContractFactory("DataGateKey")
    const gate = await DataGateKey.deploy(tokenAddr, minBalance, accessKeyBytes, dataID)
    await gate.waitForDeployment()

    console.log("✅ DataGateKey deployed at:", await gate.getAddress());
}

deployDataKey().catch(err => {console.log(err); process.exit(1); })