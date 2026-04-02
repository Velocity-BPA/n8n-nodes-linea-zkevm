/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { LineazkEVM } from '../nodes/Linea zkEVM/Linea zkEVM.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('LineazkEVM Node', () => {
  let node: LineazkEVM;

  beforeAll(() => {
    node = new LineazkEVM();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Linea zkEVM');
      expect(node.description.name).toBe('lineazkevm');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://rpc.linea.build' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getBalance';
      if (param === 'address') return '0x1234567890123456789012345678901234567890';
      if (param === 'block') return 'latest';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x1bc16d674ec80000'
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1bc16d674ec80000');
  });

  it('should get transaction count successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTransactionCount';
      if (param === 'address') return '0x1234567890123456789012345678901234567890';
      if (param === 'block') return 'latest';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x1a'
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1a');
  });

  it('should get code successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getCode';
      if (param === 'address') return '0x1234567890123456789012345678901234567890';
      if (param === 'block') return 'latest';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x608060405234801561001057600080fd5b50'
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x608060405234801561001057600080fd5b50');
  });

  it('should get storage at successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getStorageAt';
      if (param === 'address') return '0x1234567890123456789012345678901234567890';
      if (param === 'position') return '0x0';
      if (param === 'block') return 'latest';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x0000000000000000000000000000000000000000000000000000000000000001'
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getBalance';
      if (param === 'address') return 'invalid-address';
      if (param === 'block') return 'latest';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://rpc.linea.build' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('sendTransaction', () => {
    it('should send transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTransaction')
        .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
        .mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
        .mockReturnValueOnce('0x1000')
        .mockReturnValueOnce('0x5208')
        .mockReturnValueOnce('0x174876e800')
        .mockReturnValueOnce('0x');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle send transaction error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('sendTransaction');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'Network error' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getTransaction', () => {
    it('should get transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          hash: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
          from: '0x1234567890abcdef1234567890abcdef12345678',
          to: '0xabcdef1234567890abcdef1234567890abcdef12',
          value: '0x1000'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('estimateGas', () => {
    it('should estimate gas successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('estimateGas')
        .mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
        .mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
        .mockReturnValueOnce('0x1000')
        .mockReturnValueOnce('0x');

      const mockResponse = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x5208'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://rpc.linea.build' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get latest block number', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x1b4' })
    );

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1b4');
  });

  it('should get block by number', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockByNumber')
      .mockReturnValueOnce('0x1b4')
      .mockReturnValueOnce(false);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
      JSON.stringify({ jsonrpc: '2.0', id: 1, result: { number: '0x1b4' } })
    );

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.number).toBe('0x1b4');
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Network error');
  });
});

describe('Bridge Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://rpc.linea.build' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('callContract operation', () => {
    it('should successfully call bridge contract', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('callContract')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('0xabcd')
        .mockReturnValueOnce('0xfrom')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('0x0');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: '0xresult',
        id: 1
      });

      const result = await executeBridgeOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('0xresult');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            method: 'eth_call'
          })
        })
      );
    });

    it('should handle call contract error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('callContract');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Contract call failed')
      );
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBridgeOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('Contract call failed');
    });
  });

  describe('getEventLogs operation', () => {
    it('should successfully get event logs', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEventLogs')
        .mockReturnValueOnce('0x1')
        .mockReturnValueOnce('latest')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('topic1,topic2');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: [{ topics: ['topic1'], data: '0xdata' }],
        id: 1
      });

      const result = await executeBridgeOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.result).toHaveLength(1);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            method: 'eth_getLogs'
          })
        })
      );
    });
  });

  describe('getTransactionReceipt operation', () => {
    it('should successfully get transaction receipt', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransactionReceipt')
        .mockReturnValueOnce('0xhash123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: { transactionHash: '0xhash123', status: '0x1' },
        id: 1
      });

      const result = await executeBridgeOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.result.transactionHash).toBe('0xhash123');
    });
  });

  describe('estimateGas operation', () => {
    it('should successfully estimate gas', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('estimateGas')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('0xdata')
        .mockReturnValueOnce('0xfrom')
        .mockReturnValueOnce('0x5208')
        .mockReturnValueOnce('0x9184e72a000')
        .mockReturnValueOnce('0x0');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        result: '0x5208',
        id: 1
      });

      const result = await executeBridgeOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.result).toBe('0x5208');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            method: 'eth_estimateGas'
          })
        })
      );
    });
  });
});

describe('Contract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://rpc.linea.build',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should call contract function successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: '0x0000000000000000000000000000000000000000000000000000000000000001',
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('call')
			.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
			.mockReturnValueOnce('0xa9059cbb')
			.mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
			.mockReturnValueOnce('0x0')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
	});

	it('should estimate gas successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: '0x5208',
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('estimateGas')
			.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
			.mockReturnValueOnce('0xa9059cbb')
			.mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12')
			.mockReturnValueOnce('0x0')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x5208');
	});

	it('should get logs successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: [{
				address: '0x1234567890abcdef1234567890abcdef12345678',
				topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
				data: '0x0000000000000000000000000000000000000000000000000000000000000001',
				blockNumber: '0x1b4',
				transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
				logIndex: '0x0',
			}],
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getLogs')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
			.mockReturnValueOnce('["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toHaveLength(1);
		expect(result[0].json.result[0].address).toBe('0x1234567890abcdef1234567890abcdef12345678');
	});

	it('should get contract code successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: '0x608060405234801561001057600080fd5b50',
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCode')
			.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x608060405234801561001057600080fd5b50');
	});

	it('should get storage at position successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: '0x0000000000000000000000000000000000000000000000000000000000000001',
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getStorageAt')
			.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef12345678')
			.mockReturnValueOnce('0x0')
			.mockReturnValueOnce('latest')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000001');
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('call');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const items = [{ json: {} }];
		const result = await executeContractOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(executeContractOperations.call(mockExecuteFunctions, items))
			.rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Network Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://rpc.linea.build',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get chain ID successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0xe708',
    });

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0xe708');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          method: 'eth_chainId',
        }),
      }),
    );
  });

  it('should get gas price successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('gasPrice');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x9502f900',
    });

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x9502f900');
  });

  it('should get fee history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('feeHistory')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce('latest')
      .mockReturnValueOnce('[25, 50, 75]');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: {
        oldestBlock: '0x123',
        reward: [['0x1', '0x2', '0x3']],
        baseFeePerGas: ['0x4'],
        gasUsedRatio: [0.5],
      },
    });

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBeDefined();
  });

  it('should get block number successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockNumber');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: '0x1b4',
    });

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('0x1b4');
  });

  it('should get sync status successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('syncing');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: false,
    });

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe(false);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Network error'),
    );

    const result = await executeNetworkOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainId');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Network error'),
    );

    await expect(
      executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Network error');
  });
});
});
