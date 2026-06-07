import useSWR from 'swr'

export function useGetUserGroups () {
  return useSWR(['user-groups'], async ([_]) => {
    return await fetch('/api/users/user-groups').then(res => res.json())
  })
}

export function useGetGroupParticipants ({ groupId }: { groupId: string }) {
  return useSWR(['groupParticipants', groupId], async () => {
    return fetch(`/api/groups/${groupId}?getGroupParticipants=true`).then(res => res.json())
  })
}

/** @deprecated Use useGetGroupParticipants */
export const useGetGroupParticipnts = useGetGroupParticipants

export function useGetGroupAdmins ({ groupId }: { groupId: string }) {
  return useSWR(['groupAdmins', groupId], async () => {
    return fetch(`/api/groups/${groupId}?getGroupAdmins=true`).then(res => res.json())
  })
}

export function useGetMembersWithoutAdministrator ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/members-without-admins', groupId], async ([_, groupId]) => {
    return await fetch(`/api/groups/${groupId}?getMembersWithoutAdmins=true`).then(res => res.json())
  })
}

export function useGetInvitationLink ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/invitation-link', groupId], async ([url, groupId]) => {
    return await fetch(`/api/groups/${groupId}/invites?getInvitationLink=true`).then(res => res.json())
  })
}

export function useGetUsersInvitedToGroup ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups/members/invited', groupId], async ([url, groupId]) => {
    return await fetch(`/api/groups/${groupId}/invites?getUsersInvited=true`).then(res => res.json())
  })
}

export function useGetIsGroupOwner ({ groupId }: { groupId: string }) {
  return useSWR(['/api/groups', groupId], async ([url, groupId]) => {
    return await fetch(`/api/groups/${groupId}?getIsGroupOwner=true`).then(res => res.json())
  })
}
