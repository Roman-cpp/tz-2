import { getJson } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'
import type { StreamContract } from './contracts/stream.contract'
import { toStreams } from './mapping/stream.map'

export async function getStreamsApi(companyId: number, signal?: AbortSignal): Promise<Stream[]> {
  const contracts = await getJson<StreamContract[]>(`/companies/${encodeURIComponent(companyId)}/streams`, signal)
  return toStreams(contracts)
}
