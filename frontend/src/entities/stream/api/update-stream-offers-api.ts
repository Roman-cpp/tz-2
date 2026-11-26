import { putJson } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'
import type { StreamContract } from './contracts/stream.contract'
import { toStream } from './mapping/stream.map'

/** Заменяет набор оферов потока: итоговый список id, пустой — снять все. */
export async function updateStreamOffersApi(streamId: Stream['id'], offerIds: number[]): Promise<Stream> {
  const contract = await putJson<StreamContract>(
    `/streams/${encodeURIComponent(streamId)}/offers`,
    { offer_ids: offerIds },
  )
  return toStream(contract)
}
