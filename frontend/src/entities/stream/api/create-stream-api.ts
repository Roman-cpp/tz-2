import { postJson } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'
import type { StreamContract } from './contracts/stream.contract'
import { toStream } from './mapping/stream.map'

export async function createStreamApi(companyId: number, name: string): Promise<Stream> {
  const contract = await postJson<StreamContract>(
    `/companies/${encodeURIComponent(companyId)}/streams`,
    { name: name.trim() },
  )
  return toStream(contract)
}
