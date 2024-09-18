// TODO: Cambiar cuando se lleve completamente a prod
// @ts-ignore
// import bcrypt from 'bcrypt'

export function hashPassword (password: string) {
  return password
  // const salt = bcrypt.genSaltSync(10)
  // return bcrypt.hashSync(password, salt)
}

export function comparePassword (password: string, hashedPassword: string) {
  return password === hashedPassword
  // return bcrypt.compareSync(password, hashedPassword)
}
