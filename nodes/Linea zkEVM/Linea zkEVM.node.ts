/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-lineazkevm/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class LineazkEVM implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Linea zkEVM',
    name: 'lineazkevm',
    icon: 'file:lineazkevm.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Linea zkEVM API',
    defaults: {
      name: 'Linea zkEVM',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'lineazkevmApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Bridge',
            value: 'bridge',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Network',
            value: 'network',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Balance', value: 'getBalance', description: 'Get account ETH balance', action: 'Get account ETH balance' },
    { name: 'Get Transaction Count', value: 'getTransactionCount', description: 'Get account nonce', action: 'Get account nonce' },
    { name: 'Get Code', value: 'getCode', description: 'Get contract code at address', action: 'Get contract code at address' },
    { name: 'Get Storage At', value: 'getStorageAt', description: 'Get storage value at specific position', action: 'Get storage value at specific position' }
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Send Transaction', value: 'sendTransaction', description: 'Send a transaction to the network', action: 'Send transaction' },
    { name: 'Send Raw Transaction', value: 'sendRawTransaction', description: 'Send a signed raw transaction', action: 'Send raw transaction' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by hash', action: 'Get transaction' },
    { name: 'Get Transaction by Block Hash and Index', value: 'getTransactionByBlockHashAndIndex', description: 'Get transaction by block hash and index', action: 'Get transaction by block hash and index' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get transaction receipt by hash', action: 'Get transaction receipt' },
    { name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas required for a transaction', action: 'Estimate gas' }
  ],
  default: 'sendTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Block Number', value: 'getBlockNumber', description: 'Get latest block number', action: 'Get latest block number' },
    { name: 'Get Block by Number', value: 'getBlockByNumber', description: 'Get block by number', action: 'Get block by number' },
    { name: 'Get Block by Hash', value: 'getBlockByHash', description: 'Get block by hash', action: 'Get block by hash' },
    { name: 'Get Block Transaction Count by Number', value: 'getBlockTransactionCountByNumber', description: 'Get transaction count in block by number', action: 'Get block transaction count by number' },
    { name: 'Get Block Transaction Count by Hash', value: 'getBlockTransactionCountByHash', description: 'Get transaction count by block hash', action: 'Get block transaction count by hash' }
  ],
  default: 'getBlockNumber',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['bridge'] } },
  options: [
    { name: 'Call Contract', value: 'callContract', description: 'Call bridge contract methods', action: 'Call bridge contract' },
    { name: 'Get Event Logs', value: 'getEventLogs', description: 'Get bridge event logs', action: 'Get bridge event logs' },
    { name: 'Get Transaction Receipt', value: 'getTransactionReceipt', description: 'Get bridge transaction receipt', action: 'Get bridge transaction receipt' },
    { name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for bridge operations', action: 'Estimate gas for bridge operations' }
  ],
  default: 'callContract',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contract'],
		},
	},
	options: [
		{
			name: 'Call',
			value: 'call',
			description: 'Execute contract view function',
			action: 'Call a contract function',
		},
		{
			name: 'Estimate Gas',
			value: 'estimateGas',
			description: 'Estimate gas for contract interaction',
			action: 'Estimate gas for contract interaction',
		},
		{
			name: 'Get Logs',
			value: 'getLogs',
			description: 'Get contract event logs',
			action: 'Get contract event logs',
		},
		{
			name: 'Get Code',
			value: 'getCode',
			description: 'Get contract bytecode',
			action: 'Get contract bytecode',
		},
		{
			name: 'Get Storage At',
			value: 'getStorageAt',
			description: 'Get contract storage value',
			action: 'Get contract storage value',
		},
	],
	default: 'call',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['network'] } },
  options: [
    { name: 'Get Chain ID', value: 'getChainId', description: 'Get Linea chain ID', action: 'Get chain ID' },
    { name: 'Get Gas Price', value: 'gasPrice', description: 'Get current gas price', action: 'Get gas price' },
    { name: 'Get Fee History', value: 'feeHistory', description: 'Get fee history for gas estimation', action: 'Get fee history' },
    { name: 'Get Block Number', value: 'getBlockNumber', description: 'Get current block number', action: 'Get block number' },
    { name: 'Get Sync Status', value: 'syncing', description: 'Get sync status', action: 'Get sync status' },
  ],
  default: 'getChainId',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt'] } },
  default: '',
  description: 'The Ethereum address to query',
},
{
  displayName: 'Block',
  name: 'block',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getBalance', 'getTransactionCount', 'getCode', 'getStorageAt'] } },
  default: 'latest',
  description: 'Block number or tag (latest, earliest, pending)',
},
{
  displayName: 'Position',
  name: 'position',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getStorageAt'] } },
  default: '0x0',
  description: 'Storage position (hexadecimal)',
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'estimateGas'] } },
  default: '',
  description: 'The address the transaction is sent from',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'estimateGas'] } },
  default: '',
  description: 'The address the transaction is directed to',
},
{
  displayName: 'Value (Wei)',
  name: 'value',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'estimateGas'] } },
  default: '0x0',
  description: 'Value transferred in Wei (hexadecimal)',
},
{
  displayName: 'Gas',
  name: 'gas',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction'] } },
  default: '',
  description: 'Gas provided for the transaction execution (hexadecimal)',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction'] } },
  default: '',
  description: 'Gas price in Wei (hexadecimal)',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'estimateGas'] } },
  default: '',
  description: 'The data sent along with the transaction (hexadecimal)',
},
{
  displayName: 'Signed Transaction Data',
  name: 'signedData',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['sendRawTransaction'] } },
  default: '',
  description: 'The signed transaction data in hexadecimal format',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction', 'getTransactionReceipt'] } },
  default: '',
  description: 'The hash of the transaction',
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionByBlockHashAndIndex'] } },
  default: '',
  description: 'The hash of the block',
},
{
  displayName: 'Index',
  name: 'index',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransactionByBlockHashAndIndex'] } },
  default: '0x0',
  description: 'The transaction index position in the block (hexadecimal)',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  default: 'latest',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockByNumber', 'getBlockTransactionCountByNumber']
    }
  },
  description: 'Block number in hexadecimal format (e.g., 0x1b4) or "latest", "earliest", "pending"'
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockByHash', 'getBlockTransactionCountByHash']
    }
  },
  description: 'Block hash in hexadecimal format (e.g., 0x...)'
},
{
  displayName: 'Full Transactions',
  name: 'fullTransactions',
  type: 'boolean',
  default: false,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockByNumber', 'getBlockByHash']
    }
  },
  description: 'Whether to return full transaction objects or just transaction hashes'
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract', 'estimateGas'] } },
  default: '',
  description: 'The bridge contract address to call',
},
{
  displayName: 'Method Data',
  name: 'methodData',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract', 'estimateGas'] } },
  default: '',
  description: 'The encoded method data for the contract call',
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract', 'estimateGas'] } },
  default: '',
  description: 'The address to call from',
},
{
  displayName: 'Block Parameter',
  name: 'blockParameter',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract'] } },
  options: [
    { name: 'Latest', value: 'latest' },
    { name: 'Earliest', value: 'earliest' },
    { name: 'Pending', value: 'pending' },
    { name: 'Block Number', value: 'blockNumber' }
  ],
  default: 'latest',
  description: 'Which block to query',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract'], blockParameter: ['blockNumber'] } },
  default: '',
  description: 'Specific block number (in hex format)',
},
{
  displayName: 'From Block',
  name: 'fromBlock',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getEventLogs'] } },
  default: 'latest',
  description: 'Starting block for log search',
},
{
  displayName: 'To Block',
  name: 'toBlock',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getEventLogs'] } },
  default: 'latest',
  description: 'Ending block for log search',
},
{
  displayName: 'Contract Address',
  name: 'logContractAddress',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getEventLogs'] } },
  default: '',
  description: 'Filter logs by contract address',
},
{
  displayName: 'Topics',
  name: 'topics',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['getEventLogs'] } },
  default: '',
  description: 'Topics to filter logs (comma-separated)',
},
{
  displayName: 'Transaction Hash',
  name: 'transactionHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['bridge'], operation: ['getTransactionReceipt'] } },
  default: '',
  description: 'The transaction hash to get receipt for',
},
{
  displayName: 'Gas',
  name: 'gas',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['estimateGas'] } },
  default: '',
  description: 'Gas limit for the transaction',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['estimateGas'] } },
  default: '',
  description: 'Gas price for the transaction',
},
{
  displayName: 'Value',
  name: 'value',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['bridge'], operation: ['callContract', 'estimateGas'] } },
  default: '0x0',
  description: 'Value to send with the transaction',
},
{
	displayName: 'Contract Address',
	name: 'contractAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas', 'getCode', 'getStorageAt'],
		},
	},
	default: '',
	description: 'The contract address',
},
{
	displayName: 'Function Data',
	name: 'functionData',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas'],
		},
	},
	default: '',
	description: 'The encoded function call data',
},
{
	displayName: 'From Address',
	name: 'fromAddress',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas'],
		},
	},
	default: '',
	description: 'The address the transaction is sent from',
},
{
	displayName: 'Value',
	name: 'value',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas'],
		},
	},
	default: '0x0',
	description: 'The value sent with the transaction in hex',
},
{
	displayName: 'Gas Limit',
	name: 'gasLimit',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas'],
		},
	},
	default: '',
	description: 'The gas limit for the transaction in hex',
},
{
	displayName: 'Gas Price',
	name: 'gasPrice',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'estimateGas'],
		},
	},
	default: '',
	description: 'The gas price for the transaction in hex',
},
{
	displayName: 'Block Parameter',
	name: 'blockParameter',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'getCode', 'getStorageAt'],
		},
	},
	options: [
		{
			name: 'Latest',
			value: 'latest',
		},
		{
			name: 'Earliest',
			value: 'earliest',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Block Number',
			value: 'blockNumber',
		},
	],
	default: 'latest',
	description: 'The block parameter',
},
{
	displayName: 'Block Number',
	name: 'blockNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['call', 'getCode', 'getStorageAt'],
			blockParameter: ['blockNumber'],
		},
	},
	default: '',
	description: 'The block number in hex format',
},
{
	displayName: 'Storage Position',
	name: 'storagePosition',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getStorageAt'],
		},
	},
	default: '',
	description: 'The storage position in hex format',
},
{
	displayName: 'Filter From Block',
	name: 'filterFromBlock',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getLogs'],
		},
	},
	default: 'latest',
	description: 'The starting block for log filtering',
},
{
	displayName: 'Filter To Block',
	name: 'filterToBlock',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getLogs'],
		},
	},
	default: 'latest',
	description: 'The ending block for log filtering',
},
{
	displayName: 'Filter Address',
	name: 'filterAddress',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getLogs'],
		},
	},
	default: '',
	description: 'Contract address to filter logs from',
},
{
	displayName: 'Filter Topics',
	name: 'filterTopics',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getLogs'],
		},
	},
	default: '',
	description: 'Topics to filter logs by (JSON array format)',
},
{
  displayName: 'Block Count',
  name: 'blockCount',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['network'], operation: ['feeHistory'] } },
  default: 10,
  description: 'Number of blocks to return fee history for',
  placeholder: '10',
},
{
  displayName: 'Newest Block',
  name: 'newestBlock',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['network'], operation: ['feeHistory'] } },
  default: 'latest',
  description: 'Newest block to include in fee history (latest, pending, or hex block number)',
  placeholder: 'latest',
},
{
  displayName: 'Reward Percentiles',
  name: 'rewardPercentiles',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['network'], operation: ['feeHistory'] } },
  default: '[25, 50, 75]',
  description: 'Array of percentiles for reward calculation (JSON format)',
  placeholder: '[25, 50, 75]',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'bridge':
        return [await executeBridgeOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lineazkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const address = this.getNodeParameter('address', i) as string;
      const block = this.getNodeParameter('block', i, 'latest') as string;

      const baseOptions: any = {
        method: 'POST',
        url: credentials.baseUrl || 'https://rpc.linea.build',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentials.apiKey}`
        },
        json: true
      };

      switch (operation) {
        case 'getBalance': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, block],
            id: 1
          };
          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTransactionCount': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [address, block],
            id: 1
          };
          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getCode': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [address, block],
            id: 1
          };
          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getStorageAt': {
          const position = this.getNodeParameter('position', i) as string;
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getStorageAt',
            params: [address, position, block],
            id: 1
          };
          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lineazkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const baseOptions: any = {
        method: 'POST',
        url: credentials.baseUrl || 'https://rpc.linea.build',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentials.apiKey}`,
        },
        json: true,
      };

      switch (operation) {
        case 'sendTransaction': {
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const gas = this.getNodeParameter('gas', i) as string;
          const gasPrice = this.getNodeParameter('gasPrice', i) as string;
          const data = this.getNodeParameter('data', i) as string;

          const transactionObject: any = {
            from: fromAddress,
            to: toAddress,
            value: value || '0x0',
          };

          if (gas) transactionObject.gas = gas;
          if (gasPrice) transactionObject.gasPrice = gasPrice;
          if (data) transactionObject.data = data;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_sendTransaction',
            params: [transactionObject],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendRawTransaction': {
          const signedData = this.getNodeParameter('signedData', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [signedData],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByHash',
            params: [transactionHash],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionByBlockHashAndIndex': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          const index = this.getNodeParameter('index', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionByBlockHashAndIndex',
            params: [blockHash, index],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionReceipt': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateGas': {
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          const data = this.getNodeParameter('data', i) as string;

          const transactionObject: any = {
            from: fromAddress,
            to: toAddress,
            value: value || '0x0',
          };

          if (data) transactionObject.data = data;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transactionObject],
            id: 1,
          };

          const options = { ...baseOptions, body: requestBody };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lineazkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBlockNumber': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            body: JSON.stringify(requestBody),
            json: false
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getBlockByNumber': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const fullTransactions = this.getNodeParameter('fullTransactions', i) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNumber, fullTransactions],
            id: 1
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            body: JSON.stringify(requestBody),
            json: false
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getBlockByHash': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          const fullTransactions = this.getNodeParameter('fullTransactions', i) as boolean;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockByHash',
            params: [blockHash, fullTransactions],
            id: 1
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            body: JSON.stringify(requestBody),
            json: false
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getBlockTransactionCountByNumber': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockTransactionCountByNumber',
            params: [blockNumber],
            id: 1
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            body: JSON.stringify(requestBody),
            json: false
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        case 'getBlockTransactionCountByHash': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getBlockTransactionCountByHash',
            params: [blockHash],
            id: 1
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            body: JSON.stringify(requestBody),
            json: false
          };

          result = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(result);
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBridgeOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lineazkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'callContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const methodData = this.getNodeParameter('methodData', i) as string;
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const blockParameter = this.getNodeParameter('blockParameter', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i, '') as string;
          const value = this.getNodeParameter('value', i, '0x0') as string;

          const transactionObject: any = {
            to: contractAddress,
            data: methodData,
            value: value,
          };

          if (fromAddress) {
            transactionObject.from = fromAddress;
          }

          let blockParam = blockParameter;
          if (blockParameter === 'blockNumber' && blockNumber) {
            blockParam = blockNumber;
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [transactionObject, blockParam],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEventLogs': {
          const fromBlock = this.getNodeParameter('fromBlock', i, 'latest') as string;
          const toBlock = this.getNodeParameter('toBlock', i, 'latest') as string;
          const logContractAddress = this.getNodeParameter('logContractAddress', i, '') as string;
          const topics = this.getNodeParameter('topics', i, '') as string;

          const filterObject: any = {
            fromBlock: fromBlock,
            toBlock: toBlock,
          };

          if (logContractAddress) {
            filterObject.address = logContractAddress;
          }

          if (topics) {
            filterObject.topics = topics.split(',').map((topic: string) => topic.trim());
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [filterObject],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionReceipt': {
          const transactionHash = this.getNodeParameter('transactionHash', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionReceipt',
            params: [transactionHash],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateGas': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const methodData = this.getNodeParameter('methodData', i) as string;
          const fromAddress = this.getNodeParameter('fromAddress', i, '') as string;
          const gas = this.getNodeParameter('gas', i, '') as string;
          const gasPrice = this.getNodeParameter('gasPrice', i, '') as string;
          const value = this.getNodeParameter('value', i, '0x0') as string;

          const transactionObject: any = {
            to: contractAddress,
            data: methodData,
            value: value,
          };

          if (fromAddress) {
            transactionObject.from = fromAddress;
          }

          if (gas) {
            transactionObject.gas = gas;
          }

          if (gasPrice) {
            transactionObject.gasPrice = gasPrice;
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [transactionObject],
            id: 1,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeContractOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('lineazkevmApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'call': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const functionData = this.getNodeParameter('functionData', i) as string;
					const fromAddress = this.getNodeParameter('fromAddress', i) as string;
					const value = this.getNodeParameter('value', i) as string;
					const gasLimit = this.getNodeParameter('gasLimit', i) as string;
					const gasPrice = this.getNodeParameter('gasPrice', i) as string;
					const blockParameter = this.getNodeParameter('blockParameter', i) as string;
					const blockNumber = this.getNodeParameter('blockNumber', i, '') as string;

					const transactionObject: any = {
						to: contractAddress,
						data: functionData,
					};

					if (fromAddress) transactionObject.from = fromAddress;
					if (value) transactionObject.value = value;
					if (gasLimit) transactionObject.gas = gasLimit;
					if (gasPrice) transactionObject.gasPrice = gasPrice;

					const blockParam = blockParameter === 'blockNumber' ? blockNumber : blockParameter;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'eth_call',
						params: [transactionObject, blockParam],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'estimateGas': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const functionData = this.getNodeParameter('functionData', i) as string;
					const fromAddress = this.getNodeParameter('fromAddress', i) as string;
					const value = this.getNodeParameter('value', i) as string;
					const gasPrice = this.getNodeParameter('gasPrice', i) as string;

					const transactionObject: any = {
						to: contractAddress,
						data: functionData,
					};

					if (fromAddress) transactionObject.from = fromAddress;
					if (value) transactionObject.value = value;
					if (gasPrice) transactionObject.gasPrice = gasPrice;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'eth_estimateGas',
						params: [transactionObject],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'getLogs': {
					const filterFromBlock = this.getNodeParameter('filterFromBlock', i) as string;
					const filterToBlock = this.getNodeParameter('filterToBlock', i) as string;
					const filterAddress = this.getNodeParameter('filterAddress', i) as string;
					const filterTopics = this.getNodeParameter('filterTopics', i) as string;

					const filterObject: any = {};

					if (filterFromBlock) filterObject.fromBlock = filterFromBlock;
					if (filterToBlock) filterObject.toBlock = filterToBlock;
					if (filterAddress) filterObject.address = filterAddress;
					if (filterTopics) {
						try {
							filterObject.topics = JSON.parse(filterTopics);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), `Invalid topics JSON: ${error.message}`);
						}
					}

					const requestBody = {
						jsonrpc: '2.0',
						method: 'eth_getLogs',
						params: [filterObject],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'getCode': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const blockParameter = this.getNodeParameter('blockParameter', i) as string;
					const blockNumber = this.getNodeParameter('blockNumber', i, '') as string;

					const blockParam = blockParameter === 'blockNumber' ? blockNumber : blockParameter;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'eth_getCode',
						params: [contractAddress, blockParam],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'getStorageAt': {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const storagePosition = this.getNodeParameter('storagePosition', i) as string;
					const blockParameter = this.getNodeParameter('blockParameter', i) as string;
					const blockNumber = this.getNodeParameter('blockNumber', i, '') as string;

					const blockParam = blockParameter === 'blockNumber' ? blockNumber : blockParameter;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'eth_getStorageAt',
						params: [contractAddress, storagePosition, blockParam],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeNetworkOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('lineazkevmApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const rpcId = Math.floor(Math.random() * 1000000);

      switch (operation) {
        case 'getChainId': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_chainId',
            params: [],
            id: rpcId,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'gasPrice': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: rpcId,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'feeHistory': {
          const blockCount = this.getNodeParameter('blockCount', i) as number;
          const newestBlock = this.getNodeParameter('newestBlock', i) as string;
          const rewardPercentilesStr = this.getNodeParameter('rewardPercentiles', i, '[]') as string;
          
          let rewardPercentiles: number[] = [];
          try {
            rewardPercentiles = JSON.parse(rewardPercentilesStr);
          } catch (parseError: any) {
            rewardPercentiles = [];
          }

          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_feeHistory',
            params: [`0x${blockCount.toString(16)}`, newestBlock, rewardPercentiles],
            id: rpcId,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockNumber': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: rpcId,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'syncing': {
          const requestBody = {
            jsonrpc: '2.0',
            method: 'eth_syncing',
            params: [],
            id: rpcId,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://rpc.linea.build',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
