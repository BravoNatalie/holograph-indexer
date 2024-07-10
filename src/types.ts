import {
  TransactionEntity,
  HolographableContractEntity,
  NFTEntity,
  UserEntity,
} from "generated"

export enum HolographableContractTypeEnum {
  CxipERC721 = "CxipERC721",
  HolographOpenEditionERC721 = "HolographOpenEditionERC721",
  UNKNOWN = "UNKNOWN",
}

export type TransactionEntityHandlerContext = {
  Transaction: {
    readonly get: (hash: string) => TransactionEntity | undefined
    readonly set: (transaction: TransactionEntity) => void
    readonly deleteUnsafe: (hash: string) => void
  }
}

export type UserEntityHandlerContext = {
  User: {
    readonly get: (_id: string) => UserEntity | undefined
    readonly set: (user: UserEntity) => void
    readonly deleteUnsafe: (_id: string) => void
  }
}

export type HolographableContractEntityHandlerContext = {
  HolographableContract: {
    readonly get: (_1: string) => HolographableContractEntity | undefined
    readonly set: (user: HolographableContractEntity) => void
    readonly deleteUnsafe: (_1: string) => void
  }
}

export type NFTEntityHandlerContext = {
  NFT: {
    readonly get: (_1: string) => NFTEntity | undefined
    readonly set: (_1: NFTEntity) => void
    readonly deleteUnsafe: (_1: string) => void
  }
}
