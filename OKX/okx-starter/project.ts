import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "OKX-starter-via-eth",
  description:
    "This project can be use as a starting point for developing your Cosmos (OKX) based SubQuery project via the Etheruem API",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    chainId: "66",
    /**
     * These endpoint(s) should be non-pruned archive nodes
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * We suggest providing an array of endpoints for increased speed and reliability
     */
    endpoint: ["https://exchainrpc.okex.org/"],
    // dictionary: "https://api.subquery.network/sq/subquery/cosmos-okx-dictionary"
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      // Contract creation of Pangolin Token https://snowtrace.io/tx/0xfab84552e997848a43f05e440998617d641788d355e3195b6882e9006996d8f9
      startBlock: 446,
      options: {
        // Must be a key of assets
        abi: "erc20",
        address: "0x382bb369d343125bfb2117af9c149795c6c65c50", // USDT https://www.oklink.com/en/okc/address/0x382bb369d343125bfb2117af9c149795c6c65c50
      },
      assets: new Map([["erc20", { file: "./erc20.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Call,
            handler: "handleTransaction",
            filter: {
              /**
               * The function can either be the function fragment or signature
               * function: '0x095ea7b3'
               * function: '0x7ff36ab500000000000000000000000000000000000000000000000000000000'
               */
              function: "approve(address spender, uint256 value)",
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleLog",
            filter: {
              /**
                             * Follows standard log filters https://docs.ethers.io/v5/concepts/events/
                             # The topics filter follows the Ethereum JSON-PRC log filters
                             # https://docs.ethers.io/v5/concepts/events
                             # Example valid values:
                             # - '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
                             # - Transfer(address,address,u256)
                             */
              topics: ["Transfer(address from, address to, uint256 value)"],
            },
          },
        ],
      },
    },
  ],
  repository: "https://github.com/subquery/ethereum-subql-starter",
};

// Must set default to the project instance
export default project;
