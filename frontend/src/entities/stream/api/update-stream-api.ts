import { putJson } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'
import type { StreamContract } from './contracts/stream.contract'
import { toStream } from './mapping/stream.map'

export async function updateStreamApi(streamId: Stream['id'], name: string): Promise<Stream> {
  const contract = await putJson<StreamContract>(`/streams/${encodeURIComponent(streamId)}`, { name: name.trim() })
  return toStream(contract)
}
