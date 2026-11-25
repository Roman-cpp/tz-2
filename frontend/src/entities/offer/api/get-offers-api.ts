import { getJson } from '../../../shared/api/http'
import type { Offer } from '../model/offer.entity'
import type { OfferContract } from './contracts/offer.contract'
import { toOffers } from './mapping/offer.map'

export async function getOffersApi(signal?: AbortSignal): Promise<Offer[]> {
  const contracts = await getJson<OfferContract[]>(`/offers`, signal)
  return toOffers(contracts)
}
