import { getJson } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'
import type { StreamContract } from './contracts/stream.contract'
import { toStream } from './mapping/stream.map'

export async function getStreamApi(streamId: number, signal?: AbortSignal): Promise<Stream> {
  const contract = await getJson<StreamContract>(
    `/streams/${encodeURIComponent(streamId)}`,
    signal,
  )
  return toStream(contract)
}
