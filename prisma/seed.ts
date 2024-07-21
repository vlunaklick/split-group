import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  console.log('Seeding database...')
  const newUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      username: 'admin',
      password: 'contra123',
      userConfig: {
        create: {
          inviteNotification: true,
          spentNotification: true,
          paymentNotification: true,
          limit: 1000
        }
      }
    }
  })

  console.log(`Created user with id: ${newUser.id}`)

  const currencies = [
    { label: 'Dólar', symbol: '$' },
    { label: 'Peso Argentino', symbol: '$' }
  ]

  for (const currency of currencies) {
    const newCurrency = await prisma.currency.create({
      data: {
        name: currency.label,
        symbol: currency.symbol
      }
    })

    console.log(`Created currency with id: ${newCurrency.id}`)
  }

  const categories = [
    { name: 'Comida', description: 'Gastos relacionados con la comida' },
    { name: 'Transporte', description: 'Gastos relacionados con el transporte' },
    { name: 'Entretenimiento', description: 'Gastos relacionados con el entretenimiento' },
    { name: 'Salud', description: 'Gastos relacionados con la salud' },
    { name: 'Educación', description: 'Gastos relacionados con la educación' },
    { name: 'Otros', description: 'Gastos que no entran en las categorías anteriores' }
  ]

  for (const category of categories) {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        description: category.description
      }
    })

    console.log(`Created category with id: ${newCategory.id}`)
  }

  const newGroup = await prisma.group.create({
    data: {
      name: 'Personal',
      ownerId: newUser.id,
      icon: 'alien'
    }
  })

  console.log(`Created group with id: ${newGroup.id}`)

  // Add user to group

  await prisma.group.update({
    where: {
      id: newGroup.id
    },
    data: {
      users: {
        connect: {
          id: newUser.id
        }
      }
    }
  })
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
