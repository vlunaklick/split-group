import { hasGroupOwnerPermission } from './actions/permissions'
import useSWR from 'swr'

export function useHasGroupOwnerPermission ({ userId, groupId }: { userId: string, groupId: string }) {
  return useSWR(['hasGroupOwnerPermission', userId, groupId], async ([, userId, groupId]) => {
    return hasGroupOwnerPermission(userId, groupId)
  })
}
