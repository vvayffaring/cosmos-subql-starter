import {
  CosmosDatasourceKind,
  CosmosHandlerKind,
  CosmosProject,
} from "@subql/types-cosmos";

// Can expand the Datasource processor types via the genreic param
const project: CosmosProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "akash-starter",
  description:
    "This project can be use as a starting point for developing your Cosmos Akash based SubQuery project",
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
    chainId: "akashnet-2",
    /**
     * These endpoint(s) should be non-pruned archive nodes
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * We suggest providing an array of endpoints for increased speed and reliability
     */
    endpoint: [
      "https://rpc-akash.ecostake.com:443",
      "https://rpc.akashnet.net:443",
    ],
    // dictionary: "https://api.subquery.network/sq/subquery/cosmos-sei-dictionary",
    chaintypes: new Map([
      [
        "akash.staking.v1beta3",
        {
          file: "./proto/akash/staking/v1beta3/params.proto",
          messages: ["Params"],
        },
      ],
    ]),
  },
  dataSources: [
    {
      kind: CosmosDatasourceKind.Runtime,
      startBlock: 11364001,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            handler: "handleReward",
            kind: CosmosHandlerKind.Event,
            filter: {
              type: "withdraw_rewards",
              messageFilter: {
                type: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
              },
              /*
                                contractCall field can be specified here too
                                values: # A set of key/value pairs that are present in the message data
                                contract: "juno1v99ehkuetkpf0yxdry8ce92yeqaeaa7lyxr2aagkesrw67wcsn8qxpxay0"
                             */
            },
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
