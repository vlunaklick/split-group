import { PrismaClient } from '@prisma/client'
import { usersMocks, currenciesMocks, categoriesMocks } from './seed-info'

const prisma = new PrismaClient()

async function main () {
  console.log('Seeding database...')
  const users = []
  const currencies = []
  const categories = []

  for (const user of usersMocks) {
    const newUser = await prisma.user.create({
      data: {
        email: user.user.email,
        name: user.user.name,
        username: user.user.username,
        password: user.user.password,
        userConfig: {
          create: {
            inviteNotification: user.user.userConfig.inviteNotification,
            spentNotification: user.user.userConfig.spentNotification,
            paymentNotification: user.user.userConfig.paymentNotification,
            limit: user.user.userConfig.limit
          }
        }
      }
    })

    console.log(`Created user with id: ${newUser.id}`)
    users.push(newUser)
  }

  for (const currency of currenciesMocks) {
    const newCurrency = await prisma.currency.create({
      data: {
        name: currency.name,
        symbol: currency.symbol
      }
    })

    console.log(`Created currency with id: ${newCurrency.id}`)
    currencies.push(newCurrency)
  }

  for (const category of categoriesMocks) {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name
      }
    })

    console.log(`Created category with id: ${newCategory.id}`)
    categories.push(newCategory)
  }

  const group = await prisma.group.create({
    data: {
      name: 'Group 1',
      icon: 'alien',
      ownerId: users[0].id,
      users: {
        connect: users.map(user => ({ id: user.id }))
      }
    }
  })

  for (const user of users) {
    await prisma.userGroupRole.create({
      data: {
        groupId: group.id,
        userId: user.id,
        role: user.id === group.ownerId ? 'ADMIN' : 'USER'
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
