import { toBeHex } from "ethers"
/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  EditionsMetadataRendererContract,
  EditionsMetadataRenderer_EditionInitializedEntity,
  HolographRegistryContract,
  HolographRegistry_HolographableContractEventEntity,
  HolographFactoryContract,
  HolographFactory_BridgeableContractDeployedEntity,
  HolographOperatorContract,
  HolographOperator_AvailableOperatorJobEntity,
  HolographOperator_CrossChainMessageSentEntity,
  HolographOperator_FailedOperatorJobEntity,
  HolographOperator_FinishedOperatorJobEntity,
  HolographableContractContract as HolographableContract,
  HolographableContract_TransferEntity,
  HolographableContract_SecondarySaleFeesEntity,
  HolographableContract_MintFeePayoutEntity,
  HolographableContract_SaleEntity,
  EventsSummaryEntity,
} from "generated"

import { HolographableContractTypeEnum } from "./types"

import {
  handleHolographableContract,
  handleNFT,
  handleTransaction,
  handleUser,
} from "./entityHandlers"

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary"

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  editionsMetadataRenderer_EditionInitializedCount: BigInt(0),
  holographRegistry_HolographableContractEventCount: BigInt(0),
  holographFactory_BridgeableContractDeployedCount: BigInt(0),
  holographOperator_AvailableOperatorJobCount: BigInt(0),
  holographOperator_CrossChainMessageSentCount: BigInt(0),
  holographOperator_FailedOperatorJobCount: BigInt(0),
  holographOperator_FinishedOperatorJobCount: BigInt(0),
  holographableContract_TransferCount: BigInt(0),
  holographableContract_SecondarySaleFeesCount: BigInt(0),
  holographableContract_MintFeePayoutCount: BigInt(0),
  holographableContract_SaleCount: BigInt(0),
}

/// -------------- Contract: EditionsMetadataRenderer

EditionsMetadataRendererContract.EditionInitialized.loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

    context.Transaction.load(event.transactionHash)
  }
)

EditionsMetadataRendererContract.EditionInitialized.handler(
  ({ event, context }) => {
    // create or update transaction
    handleTransaction(event, context)

    /**
     * TODO: Create or update a HolographableContract with the contract type HolographOpenEditionERC721. 
     Challenge: The contract address is not directly available from the event. The event.params.target 
     refers to the getSourceContract from a HolographOpenEditionERC721 contract, which complicates obtaining the contract address.
     Action Needed: Rethink the structure to facilitate obtaining the contract address for:
     */
    // handleHolographableContract(event, context, contractAddress, HolographableContractTypeEnum.HolographOpenEditionERC721).

    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      editionsMetadataRenderer_EditionInitializedCount:
        currentSummaryEntity.editionsMetadataRenderer_EditionInitializedCount +
        BigInt(1),
    }

    const editionsMetadataRenderer_EditionInitializedEntity: EditionsMetadataRenderer_EditionInitializedEntity =
      {
        id: event.transactionHash + event.logIndex.toString(),
        target: event.params.target,
        description: event.params.description,
        imageURI: event.params.imageURI,
        animationURI: event.params.animationURI,
        logIndex: event.logIndex,
        eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
      }

    context.EventsSummary.set(nextSummaryEntity)
    context.EditionsMetadataRenderer_EditionInitialized.set(
      editionsMetadataRenderer_EditionInitializedEntity
    )
  }
)

/// ______________ Contract: HolographRegistry

HolographRegistryContract.HolographableContractEvent.loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

    context.Transaction.load(event.transactionHash)
  }
)

HolographRegistryContract.HolographableContractEvent.handler(
  ({ event, context }) => {
    // create or update transaction
    handleTransaction(event, context)

    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      holographRegistry_HolographableContractEventCount:
        currentSummaryEntity.holographRegistry_HolographableContractEventCount +
        BigInt(1),
    }

    const holographRegistry_HolographableContractEventEntity: HolographRegistry_HolographableContractEventEntity =
      {
        id: event.transactionHash + event.logIndex.toString(),
        _holographableContract: event.params._holographableContract,
        _payload: event.params._payload,
        logIndex: event.logIndex,
        eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
      }

    context.EventsSummary.set(nextSummaryEntity)
    context.HolographRegistry_HolographableContractEvent.set(
      holographRegistry_HolographableContractEventEntity
    )
  }
)

/// --------------Contract: HolographFactory

HolographFactoryContract.BridgeableContractDeployed.loader(
  ({ event, context }) => {
    context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

    // NOTE: Adds a dynamic contract address to be monitored for any HolographableContract events
    context.contractRegistration.addHolographableContract(
      event.params.contractAddress
    )

    context.Transaction.load(event.transactionHash)
    context.HolographableContract.load(event.params.contractAddress)
    if (event.txOrigin) {
      context.User.load(event.txOrigin)
    }
  }
)

HolographFactoryContract.BridgeableContractDeployed.handler(
  ({ event, context }) => {
    // create or update transaction
    handleTransaction(event, context)

    // create or update contract
    handleHolographableContract(event, context, event.params.contractAddress)

    // create or update user
    handleUser(event, context)

    // create BridgeableContractDeployed event
    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      holographFactory_BridgeableContractDeployedCount:
        currentSummaryEntity.holographFactory_BridgeableContractDeployedCount +
        BigInt(1),
    }

    const holographFactory_BridgeableContractDeployedEntity: HolographFactory_BridgeableContractDeployedEntity =
      {
        id: event.transactionHash + event.logIndex.toString(),
        contractAddress: event.params.contractAddress,
        hash: event.params.hash,
        logIndex: event.logIndex,
        eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
      }

    context.EventsSummary.set(nextSummaryEntity)
    context.HolographFactory_BridgeableContractDeployed.set(
      holographFactory_BridgeableContractDeployedEntity
    )
  }
)

/// --------------Contract: HolographableContract

// Event: Transfer
HolographableContract.Transfer.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
})

HolographableContract.Transfer.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  let tokenId: string | undefined = undefined
  if (event.params._value === 0n) {
    // TODO: it's not working for nft transfers where the "value" is the tokenId
    // tokenId = toBeHex(event.params._value, 32)
    // handleNFT(event, context, event.srcAddress, tokenId!, event.params._to)
  }

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographableContract_TransferCount:
      currentSummaryEntity.holographableContract_TransferCount + BigInt(1),
  }

  const holographableContract_TransferEntity: HolographableContract_TransferEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      from: event.params._from,
      to: event.params._to,
      value: event.params._value,
      tokenId: tokenId,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographableContract_Transfer.set(
    holographableContract_TransferEntity
  )
})

// Event: SecondarySaleFees;
HolographableContract.SecondarySaleFees.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
  context.HolographableContract.load(event.srcAddress)
})

HolographableContract.SecondarySaleFees.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  // create or update holographableContract
  handleHolographableContract(
    event,
    context,
    event.srcAddress,
    HolographableContractTypeEnum.CxipERC721 // NOTICE: Open editions also emit this event
  )

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographableContract_SecondarySaleFeesCount:
      currentSummaryEntity.holographableContract_SecondarySaleFeesCount +
      BigInt(1),
  }

  const holographableContract_SecondarySaleFeesEntity: HolographableContract_SecondarySaleFeesEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      tokenId: event.params.tokenId,
      recipients: event.params.recipients,
      bps: event.params.bps,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographableContract_SecondarySaleFees.set(
    holographableContract_SecondarySaleFeesEntity
  )
})

/// -------------- HolographDropERC721

// Event: MintFeePayout
HolographableContract.MintFeePayout.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
  context.HolographableContract.load(event.srcAddress)
})

HolographableContract.MintFeePayout.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  handleHolographableContract(
    event,
    context,
    event.srcAddress,
    HolographableContractTypeEnum.HolographOpenEditionERC721
  )

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographableContract_MintFeePayoutCount:
      currentSummaryEntity.holographableContract_MintFeePayoutCount + BigInt(1),
  }

  const holographableContract_MintFeePayoutEntity: HolographableContract_MintFeePayoutEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      mintFeeAmount: event.params.mintFeeAmount,
      mintFeeRecipient: event.params.mintFeeRecipient,
      success: event.params.success,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographableContract_MintFeePayout.set(
    holographableContract_MintFeePayoutEntity
  )
})

// Event: Sale
HolographableContract.Sale.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
  context.HolographableContract.load(event.srcAddress)
})

HolographableContract.Sale.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  handleHolographableContract(
    event,
    context,
    event.srcAddress,
    HolographableContractTypeEnum.HolographOpenEditionERC721
  )

  // TODO: add handle MOE_NFT

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographableContract_SaleCount:
      currentSummaryEntity.holographableContract_SaleCount + BigInt(1),
  }

  const holographableContract_SaleEntity: HolographableContract_SaleEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    to: event.params.to,
    quantity: event.params.quantity,
    pricePerToken: event.params.pricePerToken,
    firstPurchasedTokenId: event.params.firstPurchasedTokenId,
    logIndex: event.logIndex,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographableContract_Sale.set(holographableContract_SaleEntity)
})

/// -------------- Contract: HolographOperator

// Event: AvailableOperatorJob
HolographOperatorContract.AvailableOperatorJob.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
})

HolographOperatorContract.AvailableOperatorJob.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographOperator_AvailableOperatorJobCount:
      currentSummaryEntity.holographOperator_AvailableOperatorJobCount +
      BigInt(1),
  }

  const holographOperator_AvailableOperatorJobEntity: HolographOperator_AvailableOperatorJobEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      jobHash: event.params.jobHash,
      payload: event.params.payload,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographOperator_AvailableOperatorJob.set(
    holographOperator_AvailableOperatorJobEntity
  )
})

// Event: CrossChainMessageSent
HolographOperatorContract.CrossChainMessageSent.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
})

HolographOperatorContract.CrossChainMessageSent.handler(
  ({ event, context }) => {
    // create or update transaction
    handleTransaction(event, context)

    const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

    const currentSummaryEntity: EventsSummaryEntity =
      summary ?? INITIAL_EVENTS_SUMMARY

    const nextSummaryEntity = {
      ...currentSummaryEntity,
      holographOperator_CrossChainMessageSentCount:
        currentSummaryEntity.holographOperator_CrossChainMessageSentCount +
        BigInt(1),
    }

    const holographOperator_CrossChainMessageSentEntity: HolographOperator_CrossChainMessageSentEntity =
      {
        id: event.transactionHash + event.logIndex.toString(),
        messageHash: event.params.messageHash,
        logIndex: event.logIndex,
        eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
      }

    context.EventsSummary.set(nextSummaryEntity)
    context.HolographOperator_CrossChainMessageSent.set(
      holographOperator_CrossChainMessageSentEntity
    )
  }
)

// Event: FailedOperatorJob
HolographOperatorContract.FailedOperatorJob.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
})

HolographOperatorContract.FailedOperatorJob.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographOperator_FailedOperatorJobCount:
      currentSummaryEntity.holographOperator_FailedOperatorJobCount + BigInt(1),
  }

  const holographOperator_FailedOperatorJobEntity: HolographOperator_FailedOperatorJobEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      jobHash: event.params.jobHash,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographOperator_FailedOperatorJob.set(
    holographOperator_FailedOperatorJobEntity
  )
})

// Event: FinishedOperatorJob
HolographOperatorContract.FinishedOperatorJob.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY)

  context.Transaction.load(event.transactionHash)
})

HolographOperatorContract.FinishedOperatorJob.handler(({ event, context }) => {
  // create or update transaction
  handleTransaction(event, context)

  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY)

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    holographOperator_FinishedOperatorJobCount:
      currentSummaryEntity.holographOperator_FinishedOperatorJobCount +
      BigInt(1),
  }

  const holographOperator_FinishedOperatorJobEntity: HolographOperator_FinishedOperatorJobEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      jobHash: event.params.jobHash,
      operator: event.params.operator,
      logIndex: event.logIndex,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    }

  context.EventsSummary.set(nextSummaryEntity)
  context.HolographOperator_FinishedOperatorJob.set(
    holographOperator_FinishedOperatorJobEntity
  )
})
