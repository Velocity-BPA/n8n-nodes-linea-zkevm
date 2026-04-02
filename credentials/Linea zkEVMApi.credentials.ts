import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class LineazkEvmApi implements ICredentialType {
	name = 'lineazkEvmApi';
	displayName = 'Linea zkEVM API';
	documentationUrl = 'https://docs.linea.build/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://rpc.linea.build',
			description: 'The base URL for the Linea zkEVM RPC endpoint',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for enhanced rate limits and tracking. Leave empty for public access with lower rate limits.',
			required: false,
		},
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'Header',
					value: 'header',
					description: 'Send API key in request headers',
				},
				{
					name: 'Query Parameter',
					value: 'query',
					description: 'Send API key as query parameter',
				},
			],
			default: 'header',
			description: 'Method to authenticate API requests',
			displayOptions: {
				show: {
					apiKey: [{ _cnd: { not: '' } }],
				},
			},
		},
	];
}