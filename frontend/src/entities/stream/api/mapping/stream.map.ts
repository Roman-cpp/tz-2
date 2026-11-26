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
  return { id: contract.id, name: contract.name.trim(), share: contract.share ?? null }
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
    {
      campaignId: contract.campaign_id ?? null,
      position: contract.position ?? null,
      state: contract.state ?? null,
      createdAt: contract.created_at ?? null,
      type: contract.type ?? null,
      actionType: contract.action_type ?? null,
      actionPayload: contract.action_payload ?? null,
      schema: contract.schema_name ?? null,
      collectClicks: contract.collect_clicks ?? null,
      filterOr: contract.filter_or ?? null,
      weight: contract.weight ?? null,
      offerSelection: contract.offer_selection ?? null,
    },
  )
}

export function toStreams(contracts: StreamContract[]): Stream[] {
  return contracts.map(toStream)
}
