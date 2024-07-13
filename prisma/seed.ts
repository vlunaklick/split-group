import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const newUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      username: 'admin',
      password: 'password123',
      UserConfig: {
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
