import useSWR from 'swr'
import { getGroupParticipants, getUserGroups, hasGroupAdminPermission, getGroupAdmins, getMembersWithoutAdministrator } from './actions/groups'

export function useGetUserGroups ({ userId }: { userId: string }) {
  return useSWR(['user-groups', userId], async ([_, userId]) => {
    return await getUserGroups(userId)
  })
}

export function useHasGroupAdminPermission ({ userId, groupId }: { userId: string, groupId: string }) {
  return useSWR(['/api/groups/permissions', groupId, userId], async ([url, groupId, userId]) => {
    return await hasGroupAdminPermission(userId, groupId)
  })
}

export function useGetGroupParticipnts ({ groupId }: { groupId: string }) {
  return useSWR(['groupParticipants', groupId], async () => {
    return await getGroupParticipants(groupId)
  })
}

export function useGetGroupAdmins ({ groupId }: { groupId: string }) {
  return useSWR(['groupAdmins', groupId], async () => {
    return await getGroupAdmins(groupId)
  })
}

export function useGetMembersWithoutAdministrator ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/members-without-admins', groupId], async ([url, groupId]) => {
    return await getMembersWithoutAdministrator(groupId)
  })
}
