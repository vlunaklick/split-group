'use server'

import { db } from '@/lib/db'

export async function getUserGroups (userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId
    },
    include: {
      groups: true
    }
  })

  if (!user) {
    return []
  }

  const groups = user.groups.map(group => ({
    id: group.id,
    name: group.name,
    icon: group.icon
  }))

  return groups
}

export async function getGroup (groupId: string) {
  const group = await db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          userGroupRole: true
        }
      }
    }
  })

  return group
}

export async function hasGroupAdminPermission (userId: string, groupId: string) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    },
    select: {
      ownerId: true,
      users: {
        where: {
          id: userId
        },
        select: {
          userGroupRole: true
        }
      }
    }
  })

  if (!group || group.users.length === 0) {
    return false
  }

  if (group.ownerId === userId) {
    return true
  }

  if (group.users.length === 0) {
    return false
  }

  const members = group.users.filter(user => user.userGroupRole.filter(uG => uG.groupId === groupId && uG.role === 'ADMIN').length > 0)

  if (members.length === 0) {
    return false
  }

  return true
}

export async function getGroupParticipants (groupId: string) {
  const group = await db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      owner: true,
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          userGroupRole: {
            where: {
              groupId
            }
          }
        }
      }
    }
  })

  if (!group) {
    return []
  }

  const participants = group.users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    isOwner: group.ownerId === user.id,
    isAdmin: user.userGroupRole.filter(uG => uG.role === 'ADMIN').length > 0
  }))

  return participants
}

export async function getGroupAdmins (groupId: string) {
  const group = await db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          userGroupRole: true
        }
      }
    }
  })

  if (!group) {
    return []
  }

  const admins = group.users.filter(user => user.userGroupRole.filter(uG => uG.groupId === groupId && uG.role === 'ADMIN').length > 0)

  return admins
}

export async function getMembersWithoutAdministrator (groupId: string) {
  const group = await db.group.findUnique({
    where: {
      id: groupId
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          userGroupRole: true
        }
      }
    }
  })

  if (!group) {
    return []
  }

  const members = group.users

  const membersFiltered = members.filter(member => member.userGroupRole.filter(uG => uG.groupId === groupId && uG.role !== 'ADMIN').length > 0)

  return membersFiltered
}

export async function getInvitationLink (groupId: string) {
  return db.groupInvite.findMany({
    where: {
      groupId
    }
  })
}

export async function getUsersInvitedToGroup (groupId: string) {
  return db.notification.findMany({
    where: {
      groupId
    },
    select: {
      user: true
    }
  })
}