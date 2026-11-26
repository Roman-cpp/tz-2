import type {
  StreamContract,
  StreamFilterContract,
  StreamOfferContract,
} from '../contracts/stream.contract'
import {
  createStream,
  type Stream,
  type StreamFilter,
  type StreamOffer,
} from '../../model/stream.entity'

function toStreamOffer(contract: StreamOfferContract): StreamOffer {
  return { id: contract.id, name: contract.name.trim() }
}

function toStreamFilter(contract: StreamFilterContract): StreamFilter {
  return {
    id: contract.id,
    name: contract.name.trim(),
    mode: contract.mode.trim(),
    payload: contract.payload ?? [],
  }
}

export function toStream(contract: StreamContract): Stream {
  return createStream(
    contract.id,
    contract.name,
    (contract.offers ?? []).map(toStreamOffer),
    (contract.filters ?? []).map(toStreamFilter),
  )
}

export function toStreams(contracts: StreamContract[]): Stream[] {
  return contracts.map(toStream)
}
