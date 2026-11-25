import type { StreamContract, StreamOfferContract } from '../contracts/stream.contract'
import { createStream, type Stream, type StreamOffer } from '../../model/stream.entity'

function toStreamOffer(contract: StreamOfferContract): StreamOffer {
  return { id: contract.id, name: contract.name.trim() }
}

export function toStream(contract: StreamContract): Stream {
  return createStream(contract.id, contract.name, (contract.offers ?? []).map(toStreamOffer))
}

export function toStreams(contracts: StreamContract[]): Stream[] {
  return contracts.map(toStream)
}
