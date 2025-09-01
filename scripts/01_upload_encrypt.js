import "dotenv/config"
import crypto from "crypto";

import { Uploader } from "@irys/upload";
import { Arbitrum } from "@irys/upload-ethereum";

const getIrysUploader = async () => {
  const irysUploader = await Uploader(Arbitrum).withWallet(process.env.PRIVATE_KEY);
  return irysUploader;
};

async function uploadDataToIrys() {

    // Connect to irys
    const irys = await getIrysUploader()
    console.log("Connected as:", irys.address);

    // Content(Data) to upload
    const dataToUpload = "Congratulations, you were able to decrypt the content!"

    // Encrypting content
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
    const encrypted = Buffer.concat([cipher.update(Buffer.from(dataToUpload, "utf-8")), cipher.final()]);
    const payload = `${encrypted.toString("hex")}:${iv.toString("hex")}`

    // Upload the data to Irys
    const receipt = await irys.upload(payload);
    console.log("\n✅ Uploaded encrypted data");
    console.log("Uploaded Data URL:", `https://gateway.irys.xyz/${receipt.id}`);
    console.log("AES key (hex):", key.toString("hex"));

    // Optionally verify gateway is reachable
    const r = await fetch(`https://gateway.irys.xyz/${receipt.id}`);
    console.log("Gateway fetch status:", r.status);
}

uploadDataToIrys().catch(err => {console.log(err); process.exit(1); });