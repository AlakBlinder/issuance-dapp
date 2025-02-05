# Verified Credential Issuance Demo

> **NOTE**: This is a demo only. Do not use it in a production environment.

## Description

This is a demo service that demonstrates the issuance of verified credentials directly to Polygon ID Wallet using the [merklized on-chain issuer](https://github.com/0xPolygonID/contracts/blob/674043ddd96c1944db15079c6a00e543731724bc/contracts/examples/IdentityExample.sol). The service utilizes on-chain anchoring through Merkle trees to ensure credential verifiability.

### How It Works

1. **Credential Issuance**: 
   - The service prepares the credential data
   - Generates a QR code containing the credential offer
   - Users receive the credential directly in their Polygon ID Wallet
   - The credential's Merkle root is anchored on-chain

2. **Proof Generation**:
   - Users can generate Merkle Tree Proofs (MTP) from their wallet
   - These proofs can be used to generate Zero-Knowledge proofs
   - The ZK proofs enable on-chain verification using an [on-chain verifier](https://devs.polygonid.com/docs/verifier/on-chain-verification/overview/)

### User Flow

1. **Connect Wallet**: Users connect their MetaMask wallet
2. **Authentication**: Users authenticate with their Google account
3. **Credential Review**: Users review their credential information
4. **QR Code**: Users scan a QR code with their Polygon ID wallet
5. **Acceptance**: Users receive and store the credential directly in their Polygon ID wallet

## Quick Start Installation

### Prerequisites
- Docker
- Docker-compose
- Ngrok
- Go (for utility tools)
- Node.js and npm (for contract deployment)

### Setup Steps

1. **Deploy the Contract**
   ```bash
   # Clone the contracts repository
   git clone https://github.com/0xPolygonID/contracts.git
   cd contracts
   
   # Install dependencies and deploy
   npm install
   npm run deploy:identity:mumbai
   ```

2. **Configure Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Start ngrok tunnel
   ngrok http 8080
   ```

3. **Calculate Issuer DID**
   ```bash
   go run utils/convertor.go --contract_address=<ADDRESS_OF_ONCHAIN_ISSUER_CONTRACT>
   ```
   
   Options:
   - `--contract_address`: Contract address to convert to DID
   - `--network`: Network name (default: polygon)
   - `--chain`: Chain name (default: amoy)

4. **Configure Environment Variables**
   ```bash
   # Edit .env file with your values
   SUPPORTED_RPC="80002=<RPC_POLYGON_AMOY>"
   ISSUERS_PRIVATE_KEY="<ISSUER_DID>=<PRIVATE_KEY_OF_THE_CONTRACT_DEPLOYER>"
   EXTERNAL_HOST="<NGROK_URL>"
   ```

5. **Build and Run**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

6. Access the application at: http://localhost:3000

## Credential Verification

To verify credentials using the Query Builder:

1. Visit [Query Builder](https://tools.privado.id/query-builder)
2. Configure the following:
   - Schema: `ipfs://QmbbTKPTJy5zpS2aWBRps1duU8V3zC84jthpWDXE9mLHBX`
   - Attribute: Select `balance`
   - Proof Type: `Merkle Tree Proof (MTP)`
   - Circuit ID: `Credential Atomic Query MTP v2`
   - Query Type: Choose appropriate type
   - Operator: Select if using Conditional query
   - Value: Provide if using Conditional query

3. Generate and scan the QR code with your Polygon ID wallet

## Development

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend service
├── contracts/        # Smart contract interfaces
└── utils/           # Utility scripts and tools
```

### Key Features
- On-chain credential anchoring
- Google OAuth integration
- MetaMask wallet connection
- QR code credential issuance
- MTP proof generation

## License

verified-credential-issuance-demo is part of the 0xPolygonID project copyright 2024 ZKID Labs AG

This project is licensed under either of:
- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) ([`LICENSE-APACHE`](LICENSE-APACHE))
- [MIT license](https://opensource.org/licenses/MIT) ([`LICENSE-MIT`](LICENSE-MIT))

at your option.
