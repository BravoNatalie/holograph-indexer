// import { v4 as uuidv4 } from "uuid"

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
      // NOTE: For now, the ID will be the same as the hash until a `where` clause is available for the `load` and `get` functions in the event handler.
      id: event.transactionHash, // uuidv4(),
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
      // NOTE: For now, the ID will be the same as the contractAddress until a `where` clause is available for the `load` and `get` functions in the event handler.
      id: contractAddress, // uuidv4(),
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
        // NOTE: For now, the ID is going to be the walletAddress
        id: event.txOrigin, // uuidv4(),
        address: event.txOrigin,
      }
      context.User.set(user)
    }
  }
}

export function handleNFT<E>(
  event: EventLog<E>,
  context: NFTEntityHandlerContext,
  contractAddress: string,
  tokenId: string,
  owner: string
) {
  // '0x' + remove0x(tokenId.toHexString()).padStart(64, '0')
  // pad(toHex(tokenId), { size: 32 })
  const id = `${contractAddress}${tokenId}`
  const dbNFTEntry = context.NFT.get(id)

  let nft: NFTEntity
  if (dbNFTEntry) {
    nft = {
      ...dbNFTEntry,
      chainId: event.chainId,
      tokenId,
      owner,
    }
  } else {
    nft = {
      // NOTE: NOTE: For now, the ID will be the contractAddress + tokenId until a `where` clause is available for the `load` and `get` functions in the event handler.
      id, // uuidv4(),
      chainId: event.chainId,
      contractAddress,
      tokenId,
      owner,
    }
  }
  context.NFT.set(nft)
}
