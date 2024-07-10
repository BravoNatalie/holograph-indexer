# Holograph Indexer

> [!WARNING]
> This is not an official project.

This project is a custom multi-chain indexer designed for the [Holograph Protocol](https://www.holograph.xyz/).


## Overview

Holograph is an omnichain tokenization protocol that allows asset issuers to mint natively composable omnichain tokens. The Holograph Indexer focuses on indexing the main events emitted by the key protocol smart contracts deployed across multiple networks.


## Features

- **Multi-Chain Support**: Indexes events from smart contracts deployed on various blockchain networks.
- **Real-Time and Historical Data**: Provides access to both live and past event data.
- **Efficient Data Handling**: Utilizes [Envio](https://envio.dev/)'s indexing framework to streamline data access, organization, and querying.


## Indexed Events

The Holograph Indexer captures specific events that are crucial for the major functionalities the protocol offers to its users, including ERC721 contract deployment, Open Edition contract deployment, NFT mints, and bridging activities.

### Captured Events and Their Operations

- **Contract Deployment**:
  - ERC721 Contract
  - Open Edition Contract
- **NFT Mint**:
  - Standard Mint
  - OE Purchase
- **Bridging**:
  - Bridge Out from Source Chain
  - Message Layer
  - Bridge In to Destination Chain

### Detailed Event Descriptions

#### Contract Deployment

When a contract is deployed, several key events are emitted to capture important details of the deployment process:

- **BridgeableContractDeployed**: Emitted for each deployed contract, indicating the successful creation of a bridgeable contract.
- **SecondarySaleFees**: Emitted if royalties are configured for the deployed contract, detailing the setup of secondary sale fees.
- **EditionInitialized**: Specifically for Open Edition contracts, this event is emitted to signify the initialization of the edition metadata.

#### NFT Mint

Minting an NFT involves several key events that detail the creation and transfer of the asset:

- **HolographableContractEvent**: Emitted to signify an action on a Holograph-compatible contract.
- **Transfer**: Emitted for the transfer of NFT to the new owner.
- **Sale**: Specifically for Open Edition mints, this event captures the details of the sale.
- **MintFeePayout**: Also for Open Edition mints, this event details the payout of minting fees.

#### Bridging

The bridging process involves several stages and events to ensure assets are accurately transferred across chains:

- **Bridge Out from Source Chain**: The event **CrossChainMessageSent** is emitted, indicating the initiation of the bridge transfer.
- **Message Layer**: The event **AvailableOperatorJob** is emitted, representing the availability of a new operator job to finished the bridge after the message layer step is completed.
- **Bridge In to Destination Chain**: The event **FinishedOperatorJob** is emitted upon completion of the bridge transfer. In case of failure, the event **FailedOperatorJob** is also emitted to indicate the unsuccessful attempt.

| **Operation**               | **Event Name**                   | **Description**                                                         | **Context**                           |
|-----------------------------|----------------------------------|-------------------------------------------------------------------------|---------------------------------------|
| **Contract Deployment**     | **BridgeableContractDeployed**   | Emitted for each deployed contract to signify successful creation.      | ERC721 and Open Edition contracts     |
|                             | **SecondarySaleFees**            | Emitted if royalties are set, detailing secondary sale fee setup.       | ERC721 and Open Edition contracts     |
|                             | **EditionInitialized**           | Specific to Open Edition contracts, emitted for edition initialization. | Open Edition contracts only           |
|                             |                                  |                                                                         |                                       |
| **NFT Mint**                | **HolographableContractEvent**   | Indicates an action on a Holograph-compatible contract.                 | Standard NFT and Open Edition mints   |
|                             | **Transfer**                     | Emitted for the transfer of ownership of the minted NFT.                | Standard NFT and Open Edition mints   |
|                             | **Sale**                         | Specific to Open Edition mints, captures sale details.                  | Open Edition mints only               |
|                             | **MintFeePayout**                | Details the payout of minting fees for Open Edition mints.              | Open Edition mints only               |
|                             |                                  |                                                                         |                                       |
| **Bridging**                | **CrossChainMessageSent**        | Indicates the start of the bridge transfer from the source chain.       | Bridge Out from source chain          |
|                             | **AvailableOperatorJob**         | Emitted by the Message Layer to signal a new operator job.              | Message Layer                         |
|                             | **FinishedOperatorJob**          | Emitted on successful completion of the bridge transfer.                | Bridge In to destination chain        |
|                             | **FailedOperatorJob**            | Indicates a failed attempt to complete the bridge transfer.             | Bridge In to destination chain (fail) |



## Technology Stack

The indexer leverages the [Envio](https://envio.dev/) indexing framework, which offers a streamlined approach to:

- Accessing blockchain data seamlessly.
- Efficiently organizing and structuring data.
- Querying real-time data and retrieving historical information effortlessly.

### Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- **Node.js**: Version 18 or newer.
- **pnpm**: Version 8 or newer.
- **Docker Desktop**

Make sure your development environment meets these requirements to ensure smooth operation of the indexer.


## How to Run

Envio sets up default values for the PostgreSQL database and Hasura dashboard in `generated/docker-compose.yaml`. If you want to override these values, use the following environment variables:

```sh
ENVIO_PG_PORT=5432 # The PostgreSQL database port
ENVIO_POSTGRES_PASSWORD=postgres-password # The PostgreSQL database password
ENVIO_PG_USER=envio-indexer # The PostgreSQL database user
ENVIO_PG_DATABASE=holograph-indexer-prod # The PostgreSQL database name

HASURA_EXTERNAL_PORT=8080 # The Hasura client dashboard port
HASURA_GRAPHQL_ENABLE_CONSOLE=true # Enable the Hasura client dashboard
HASURA_GRAPHQL_ADMIN_SECRET=hasura-admin-secret # The Hasura client dashboard admin secret
```

1. **Install Envio CLI**:
   Install Envio globally using npm:
   ```sh
   npm install -g envio
   ```

2. **Install Dependencies**:
   Install the project dependencies using pnpm:
   ```sh
   pnpm install
   ```

3. **Run the Indexer Locally**:
   Start the indexer locally with:
   ```sh
   envio dev
   ```

4. **Stop the Indexer**:
   Stop the indexer using:
   ```sh
   envio stop
   ```

5. **Regenerate Code**:
   If there are any changes to `config.yaml` or `schema.graphql`, regenerate the automated code using:
   ```sh
   envio codegen
   ```

For more details, refer to the [Envio documentation](https://docs.envio.dev/docs/HyperIndex/overview).

<br/>

---

<p align="center">
<a href="https://www.linkedin.com/in/nataliebravo/" target="_blank">
  <img alt="LinkedIn - Natalie Bravo" src="https://img.shields.io/badge/LinkedIn--%23F8952D?style=social&logo=linkedin">
</a>
<br/>
  Made with ☕ and ❤️ by <b>Natalie Bravo</b>.
<p/>