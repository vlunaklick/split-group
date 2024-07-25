'use server'

import { db } from './db'

export async function isValidChangePassword (hash: string) {
  const changePasswordRequest = await db.forgotPassword.findFirst({
    where: { code: hash }
  })

  if (!changePasswordRequest) {
    return false
  }

  return true
}

export async function getAvailableCurrency () {
  const currencies = await db.currency.findMany()

  return currencies.map(currency => ({
    id: currency.id,
    name: currency.name,
    symbol: currency.symbol
  }))
}

export async function getUserConfiguration (userId: string) {
  const configuration = await db.userConfig.findFirst({
    where: {
      userId
    }
  })

  return configuration
}

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

export async function hasGroupOwnerPermission (userId: string, groupId: string) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group) {
    return false
  }

  if (group.ownerId !== userId) {
    return false
  }

  return true
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

export async function giveAdminPermission (userId: string, groupId: string) {
  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (userGroupRole) {
    return await db.userGroupRole.update({
      where: {
        id: userGroupRole.id
      },
      data: {
        role: 'ADMIN'
      }
    })
  }

  return await db.userGroupRole.create({
    data: {
      userId,
      groupId,
      role: 'ADMIN'
    }
  })
}

export async function removeAdminPermission (userId: string, groupId: string) {
  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.update({
    where: {
      id: userGroupRole.id
    },
    data: {
      role: 'USER'
    }
  })
}

export async function removeMemberFromGroup (userId: string, groupId: string) {
  const group = await db.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!group || group.ownerId === userId) {
    return
  }

  await db.group.update({
    where: {
      id: groupId
    },
    data: {
      users: {
        disconnect: {
          id: userId
        }
      }
    }
  })

  const userGroupRole = await db.userGroupRole.findFirst({
    where: {
      userId,
      groupId
    }
  })

  if (!userGroupRole) {
    return
  }

  return await db.userGroupRole.delete({
    where: {
      id: userGroupRole.id
    }
  })
}

export async function updateGroup (groupId: string, name: string, description: string) {
  return await db.group.update({
    where: {
      id: groupId
    },
    data: {
      name,
      description
    }
  })
}

export async function deleteGroup (groupId: string) {
  await db.userGroupRole.deleteMany({
    where: {
      groupId
    }
  })

  await db.spending.deleteMany({
    where: {
      groupId
    }
  })

  await db.payers.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.groupInvite.deleteMany({
    where: {
      groupId
    }
  })

  await db.comment.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.involved.deleteMany({
    where: {
      spending: {
        groupId
      }
    }
  })

  await db.group.delete({
    where: {
      id: groupId
    }
  })
}

export async function getAmountNotifications (userId: string) {
  const notifications = await db.notification.findMany({
    where: {
      userId,
      read: false
    }
  })

  return notifications.length
}
