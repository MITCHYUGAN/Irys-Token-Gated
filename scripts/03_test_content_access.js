import "dotenv/config";
import { ethers } from "ethers";
import crypto from "crypto"

async function makeProvider() {
  const url = "https://testnet-rpc.irys.xyz/v1/execution-rpc";
  const p = new ethers.JsonRpcProvider(url);
  await p.getBlockNumber();
  return p;
}

async function main() {
  const gateAddr = process.argv[2];
  if (!gateAddr) throw new Error("Usage: node scripts/04_test_access_node.js 0x4791555cfc9dCc4F357415f6e388e6bDb1f61862");

  const provider = await makeProvider();
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const user = await signer.getAddress();

  const abi = [
    "function canAccess(address) view returns (bool)",
    "function getKey() view returns (bytes)",
    "function getDataID() view returns (string)"
  ];
  const gate = new ethers.Contract(gateAddr, abi, signer);

  console.log("Caller:", user);
  const can = await gate.canAccess(user);
  console.log("canAccess:", can);

  if (!can) { console.log("User does not meet token threshold."); return; }

  const keyHex = await gate.getKey();
  const key = Buffer.from(keyHex.slice(2), "hex");
  console.log("AES key (hex):", key.toString("hex"));

  const dataId = await gate.getDataID();
  console.log("DataId:", dataId);

  const url = `https://gateway.irys.xyz/${dataId}`;
  const res = await fetch(url);
  const text = await res.text(); // ciphertext:ivHex
  const [encHex, ivHex] = text.split(":");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(ivHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encHex, "hex")), decipher.final()]);
  console.log("Decrypted content:\n", decrypted.toString("utf8"));
}

main().catch(e => { console.error(e); process.exit(1); });