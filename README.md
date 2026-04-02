# n8n-nodes-linea-zkevm

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with the Linea zkEVM blockchain network. This node provides 6 comprehensive resources for blockchain operations including accounts, transactions, blocks, bridge operations, smart contracts, and network management with full zkEVM compatibility.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Linea](https://img.shields.io/badge/Linea-zkEVM-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Layer%202-purple)
![EVM](https://img.shields.io/badge/EVM-Compatible-orange)

## Features

- **Account Management** - Create, import, and manage Ethereum accounts with Linea zkEVM compatibility
- **Transaction Operations** - Send, query, and monitor transactions on the Linea network with gas optimization
- **Block Exploration** - Retrieve block data, headers, and transaction lists with zkEVM-specific metadata
- **Bridge Functionality** - Cross-chain bridging operations between Ethereum mainnet and Linea zkEVM
- **Smart Contract Interaction** - Deploy, call, and manage smart contracts with zkEVM bytecode support
- **Network Management** - Monitor network status, gas prices, and zkEVM-specific network parameters
- **Zero-Knowledge Proofs** - Access zkEVM proof generation and verification capabilities
- **Layer 2 Optimization** - Built-in support for Linea's rollup architecture and cost-efficient operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-linea-zkevm`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-linea-zkevm
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-linea-zkevm.git
cd n8n-nodes-linea-zkevm
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-linea-zkevm
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Linea zkEVM API key for blockchain access | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional, defaults to Linea mainnet) | No |
| Network | Target network (mainnet, testnet) | Yes |
| Private Key | Wallet private key for transaction signing (encrypted storage) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balance in ETH and tokens |
| Get Transaction History | Fetch transaction history for an account |
| Create Account | Generate new Ethereum account |
| Import Account | Import account from private key or mnemonic |
| Get Nonce | Get current nonce for transaction ordering |
| Validate Address | Verify Ethereum address format and checksum |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send Transaction | Send ETH or token transactions on Linea |
| Get Transaction | Retrieve transaction details by hash |
| Get Receipt | Get transaction receipt and execution status |
| Estimate Gas | Calculate gas costs for transaction execution |
| Get Status | Check transaction confirmation status |
| Batch Transactions | Submit multiple transactions efficiently |
| Cancel Transaction | Cancel pending transaction with higher gas |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block data by number or hash |
| Get Latest Block | Fetch most recent block information |
| Get Block Range | Get multiple blocks within specified range |
| Get Block Header | Retrieve block header with zkEVM proofs |
| Get Transactions | List all transactions in a specific block |
| Get Uncle Blocks | Fetch uncle blocks (if applicable) |

### 4. Bridge

| Operation | Description |
|-----------|-------------|
| Bridge ETH | Bridge ETH from Ethereum to Linea or vice versa |
| Bridge Token | Bridge ERC-20 tokens across chains |
| Get Bridge Status | Check status of bridge transactions |
| Estimate Bridge Fee | Calculate costs for cross-chain transfers |
| Get Bridge History | Retrieve bridge transaction history |
| Claim Bridged Assets | Claim assets on destination chain |

### 5. Contract

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy smart contracts to Linea zkEVM |
| Call Function | Execute read-only contract functions |
| Send Transaction | Execute state-changing contract functions |
| Get Contract Info | Retrieve contract metadata and ABI |
| Verify Contract | Verify contract source code |
| Get Events | Query contract event logs |
| Estimate Gas | Calculate gas for contract interactions |

### 6. Network

| Operation | Description |
|-----------|-------------|
| Get Network Info | Retrieve network status and parameters |
| Get Gas Price | Fetch current gas price recommendations |
| Get Chain ID | Get Linea network chain identifier |
| Check Sync Status | Monitor node synchronization status |
| Get Validator Info | Retrieve validator and consensus data |
| Get zkEVM Stats | Access zero-knowledge proof statistics |

## Usage Examples

```javascript
// Send ETH transaction on Linea
{
  "resource": "Transaction",
  "operation": "Send Transaction",
  "to": "0x742d35Cc6634C0532925a3b8D0e3e3B4e7B0E6D3",
  "value": "0.1",
  "gasLimit": 21000,
  "gasPrice": "1000000000"
}
```

```javascript
// Bridge tokens from Ethereum to Linea
{
  "resource": "Bridge",
  "operation": "Bridge Token",
  "tokenAddress": "0xA0b86991c431E80E0eA9E0C0C5e4C5b5b3F4E3A8E",
  "amount": "100",
  "destinationAddress": "0x742d35Cc6634C0532925a3b8D0e3e3B4e7B0E6D3",
  "direction": "ethereum-to-linea"
}
```

```javascript
// Deploy smart contract on Linea zkEVM
{
  "resource": "Contract",
  "operation": "Deploy Contract",
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "abi": "[{\"inputs\":[],\"name\":\"myFunction\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
  "constructorArgs": ["param1", "param2"]
}
```

```javascript
// Get zkEVM network statistics
{
  "resource": "Network",
  "operation": "Get zkEVM Stats",
  "includeProofs": true,
  "timeframe": "24h"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has sufficient permissions |
| Insufficient Funds | Account balance too low for transaction | Check account balance and ensure sufficient ETH for gas |
| Gas Limit Exceeded | Transaction requires more gas than specified | Increase gas limit or optimize contract code |
| Network Congestion | High network traffic causing delays | Increase gas price or retry during off-peak hours |
| Bridge Timeout | Cross-chain transaction taking longer than expected | Check bridge status and wait for confirmation |
| Contract Revert | Smart contract execution failed | Review contract function requirements and parameters |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-linea-zkevm/issues)
- **Linea Documentation**: [Linea Developer Docs](https://docs.linea.build/)
- **zkEVM Resources**: [Linea zkEVM Guide](https://docs.linea.build/developers)