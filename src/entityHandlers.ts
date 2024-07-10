import { v4 as uuidv4 } from "uuid"

import {
  TransactionEntity,
  HolographableContractEntity,
  NFTEntity,
  UserEntity,
  EventLog,
} from "generated"

import {
  HolographableContractEntityHandlerContext,
  TransactionEntityHandlerContext,
  UserEntityHandlerContext,
  NFTEntityHandlerContext,
  HolographableContractTypeEnum,
} from "./types"

export function handleTransaction<E>(
  event: EventLog<E>,
  context: TransactionEntityHandlerContext
) {
  const dbTransactionEntry = context.Transaction.get(event.transactionHash)

  let transaction: TransactionEntity
  if (dbTransactionEntry) {
    transaction = {
      ...dbTransactionEntry,
      logIndexes: [...dbTransactionEntry.logIndexes, event.logIndex],
    }
  } else {
    transaction = {
      id: uuidv4(),
      hash: event.transactionHash,
      chainId: event.chainId,
      blockNumber: event.blockNumber,
      blockTimestamp: event.blockTimestamp,
      from: event.txOrigin,
      to: event.txTo,
      logIndexes: [event.logIndex],
    }
  }
  context.Transaction.set(transaction)
}

export function handleHolographableContract<E>(
  event: EventLog<E>,
  context: HolographableContractEntityHandlerContext,
  contractAddress: string,
  contractType = HolographableContractTypeEnum.UNKNOWN
) {
  const dbHolographableContractEntry =
    context.HolographableContract.get(contractAddress)

  let holographableContract: HolographableContractEntity
  if (dbHolographableContractEntry) {
    const existChainId = dbHolographableContractEntry.chainIds.includes(
      event.chainId
    )
    if (!existChainId) {
      holographableContract = {
        ...dbHolographableContractEntry,
        chainIds: [...dbHolographableContractEntry.chainIds, event.chainId],
      }
      context.HolographableContract.set(holographableContract)
    }
  } else {
    holographableContract = {
      id: uuidv4(),
      chainIds: [event.chainId],
      contractAddress,
      contractType,
    }
    context.HolographableContract.set(holographableContract)
  }
}

export function handleUser<E>(
  event: EventLog<E>,
  context: UserEntityHandlerContext
) {
  if (event.txOrigin) {
    const dbUserEntry = context.User.get(event.txOrigin)
    if (!dbUserEntry) {
      const user: UserEntity = {
        id: uuidv4(),
        walletAddress: event.txOrigin,
      }
      context.User.set(user)
    }
  }
}
