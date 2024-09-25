import { hashPassword } from '../src/utils/password-utils'

export const usersMocks = [
  {
    user: {
      email: 'admin@example.com',
      name: 'admin',
      username: 'admin',
      password: hashPassword('contra123'),
      userConfig: {
        inviteNotification: true,
        spentNotification: false,
        paymentNotification: true,
        limit: 500
      }
    }
  },
  {
    user: {
      email: 'user@example.com',
      name: 'User',
      username: 'user',
      password: hashPassword('contra123'),
      userConfig: {
        inviteNotification: false,
        spentNotification: true,
        paymentNotification: false,
        limit: 2000
      }
    }
  },
  {
    user: {
      email: 'user2@example.com',
      name: 'User2',
      username: 'user2',
      password: hashPassword('contra123'),
      userConfig: {
        inviteNotification: true,
        spentNotification: true,
        paymentNotification: true,
        limit: 1000
      }
    }
  }
]

export const currenciesMocks = [
  { name: 'Dólar', symbol: '$' },
  { name: 'Peso Argentino', symbol: '$' }
]

export const categoriesMocks = [
  { name: 'Comida', description: 'Gastos relacionados con la comida' },
  { name: 'Transporte', description: 'Gastos relacionados con el transporte' },
  { name: 'Entretenimiento', description: 'Gastos relacionados con el entretenimiento' },
  { name: 'Salud', description: 'Gastos relacionados con la salud' },
  { name: 'Educación', description: 'Gastos relacionados con la educación' },
  { name: 'Otros', description: 'Gastos que no entran en las categorías anteriores' }
]
