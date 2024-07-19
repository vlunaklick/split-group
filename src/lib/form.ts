import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(2, { message: 'El nombre de usuario tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre de usuario no puede tener más de 32 caracteres' }).regex(/^[a-zA-Z0-9äöüÄÖÜ]*$/, { message: 'El nombre de usuario solo puede contener letras y números' }),
  password: z.string().min(8, { message: 'La contraseña tiene que tener al menos 8 caracteres' }).max(32, { message: 'La contraseña no puede tener más de 32 caracteres' })
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Debe ser un correo electrónico válido' })
})

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre no puede tener más de 32 caracteres' }),
  email: z.string().email({ message: 'Debe ser un correo electrónico válido' }),
  username: z.string().min(2, { message: 'El nombre de usuario tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre de usuario no puede tener más de 32 caracteres' }).regex(/^[a-zA-Z0-9äöüÄÖÜ]*$/, { message: 'El nombre de usuario solo puede contener letras y números' }),
  password: z.string().min(8, { message: 'La contraseña tiene que tener al menos 8 caracteres' }).max(32, { message: 'La contraseña no puede tener más de 32 caracteres' })
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }).max(32, { message: 'La contraseña debe tener como máximo 32 caracteres' }),
  confirmPassword: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }).max(32, { message: 'La contraseña debe tener como máximo 32 caracteres' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export const changeUsernameSchema = z.object({
  username: z.string().min(2, { message: 'El nombre de usuario tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre de usuario no puede tener más de 32 caracteres' }).regex(/^[a-zA-Z0-9äöüÄÖÜ]*$/, { message: 'El nombre de usuario solo puede contener letras y números' })
})

export const changeNameSchema = z.object({
  name: z.string().min(2, { message: 'El nombre tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre no puede tener más de 32 caracteres' })
})

export const updateAlertsSettingsSchema = z.object({
  amount: z.coerce.number().int().min(0, { message: 'El monto no puede ser negativo' })
})

export const updateNotificationsWantedSettingsSchema = z.object({
  invitations: z.boolean().default(false).optional(),
  spents: z.boolean().default(false).optional(),
  payments: z.boolean().default(false).optional()
})
