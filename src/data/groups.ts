import useSWR from 'swr'
import { getGroupAdmins, getGroupParticipants, getInvitationLink, getMembersWithoutAdministrator, getUsersInvitedToGroup, hasGroupAdminPermission } from './actions/groups'

export function useGetUserGroups () {
  return useSWR(['user-groups'], async ([_]) => {
    return await fetch('/api/users/user-groups').then(res => res.json())
  })
}

export function useHasGroupAdminPermission ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/permissions', groupId], async ([url, groupId]) => {
    return await hasGroupAdminPermission(groupId)
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

export function useGetInvitationLink ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/invitation-link', groupId], async ([url, groupId]) => {
    return await getInvitationLink(groupId)
  })
}

export function useGetUsersInvitedToGroup ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/members/invited', groupId], async ([url, groupId]) => {
    return await getUsersInvitedToGroup(groupId)
  })
}

export function useGetIsGroupOwner ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups', groupId], async ([url, groupId]) => {
    return await fetch(`/api/groups/${groupId}?isOwner=true`).then(res => res.json())
  })
}
