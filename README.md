# Irys Token-Gated Access Demo

This project shows how to use an **ERC-20 token balance** to gate access to **encrypted content stored on Irys**.  
Users who hold enough tokens can unlock and decrypt the gated content directly.

---

## 📦 Setup

### 1. Clone and install dependencies
```bash
git clone <this-repo>
cd irys-token-gated
npm install
```

### 2. Configure environment
Create a `.env` file:
```
PRIVATE_KEY=your_private_key_here
TOKEN_ADDRESS=0x...   # ERC20 token contract address
DATA_ID=...           # Irys upload ID (set after upload step)
ACCESS_KEY=...        # AES key hex (set after upload step)
MIN_BALANCE=1         # Min token balance required
```

## 🚀 Workflow
### Step 1: Upload & encrypt content
```
node scripts/01_upload_encrypt.js
```

👉 Save the DATA_ID and ACCESS_KEY output to `.env`.

### Step 2: Deploy the gate contract
```
npx hardhat run scripts/02_deploy_content_gate_key.js --network irys
```

### Step 3: Test access
```
node scripts/03_test_content_access.js <gateAddress>
```

Expected output:
```
Caller: 0xYourWallet
canAccess: true
AES key (hex): ...
DataId: ...
Decrypted content:
  <Decrypted Content>
```

`DataGateKey.sol`

Stores:
* ERC-20 token address
* Minimum balance
* AES decryption key
* Irys Data ID

Functions:
- canAccess(user) → returns true/false
- getKey() → returns AES key if authorized
- getDataID() → returns Data ID if authorized