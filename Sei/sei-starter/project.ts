import {
  CosmosDatasourceKind,
  CosmosHandlerKind,
  CosmosProject,
} from "@subql/types-cosmos";

// Can expand the Datasource processor types via the genreic param
const project: CosmosProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "sei-starter",
  description:
    "This project can be use as a starting point for developing your Cosmos sei based SubQuery project",
  runner: {
    node: {
      name: "@subql/node-cosmos",
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
    /* The genesis hash of the network (hash of block 0) */
    chainId: "pacific-1",
    /**
     * These endpoint(s) should be non-pruned archive nodes
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * We suggest providing an array of endpoints for increased speed and reliability
     */
    endpoint: [
      "https://rpc.ankr.com/sei",
    ],
    // Optionally provide the HTTP endpoint of a full chain dictionary to speed up processing
    dictionary:
      "https://api.subquery.network/sq/subquery/cosmos-sei-dictionary",
    chaintypes: new Map([
      // This feature allows support for any Cosmos chain by importing the correct protobuf messages
      [
        "cosmos.bank.v1beta1.MsgSend",
        {
          file: "./proto/cosmos/bank/v1beta1/tx.proto",
          messages: ["MsgSend"],
        },
      ],
    ]),
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 24596905,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleFundingRateChangeEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              // https://sei.explorers.guru/transaction/9A5D1FB99CDFB03282459355E4C7221D93D9971160AE79E201FA2B2895952878
              type: "wasm-funding-rate-change",
              messageFilter: {
                type: "/cosmwasm.wasm.v1.MsgExecuteContract",
              },
            },
          },
          {
            handler: "handleSpotPriceEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "wasm-spot-price",
              messageFilter: {
                type: "/cosmwasm.wasm.v1.MsgExecuteContract",
              },
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
