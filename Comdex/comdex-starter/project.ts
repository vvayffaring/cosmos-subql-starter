import {
  CosmosDatasourceKind,
  CosmosHandlerKind,
  CosmosProject,
} from "@subql/types-cosmos";

// Can expand the Datasource processor types via the genreic param
const project: CosmosProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "comdex-starter",
  description:
    "This project can be use as a starting point for developing your Cosmos Comdex based SubQuery project",
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
    chainId: "comdex-1",
    /**
     * These endpoint(s) should be non-pruned archive nodes
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * We suggest providing an array of endpoints for increased speed and reliability
     */
    endpoint: ["https://rpc-comdex.zenchainlabs.io/"],
    chaintypes: new Map([
      // This feature allows support for any Cosmos chain by importing the correct protobuf messages
      [
        "cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        {
          //CIRCUMVENTING VIA ORDER
          file: "./proto/cosmos/distribution/v1beta1/tx.proto",
          messages: ["MsgWithdrawDelegatorReward"],
        },
      ],
    ]),
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 1,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleEvent",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "coin_spent",
              messageFilter: {
                type: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
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
