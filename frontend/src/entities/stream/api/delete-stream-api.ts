import { deleteRequest } from '../../../shared/api/http'
import type { Stream } from '../model/stream.entity'

export async function deleteStreamApi(streamId: Stream['id']): Promise<void> {
  await deleteRequest(`/streams/${encodeURIComponent(streamId)}`)
}
