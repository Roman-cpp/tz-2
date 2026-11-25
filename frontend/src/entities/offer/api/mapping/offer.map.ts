import type { OfferContract } from '../contracts/offer.contract'
import { createOffer, type Offer } from '../../model/offer.entity'

export function toOffer(contract: OfferContract): Offer {
  return createOffer(contract.id, contract.name)
}

export function toOffers(contracts: OfferContract[]): Offer[] {
  return contracts.map(toOffer)
}
