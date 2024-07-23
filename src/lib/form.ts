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

export const updateAlertLimitSettingsSchema = z.object({
  amount: z.coerce.number().int().min(0, { message: 'El monto no puede ser negativo' })
})

export const updateNotificationsWantedSettingsSchema = z.object({
  invitations: z.boolean().default(false).optional(),
  spents: z.boolean().default(false).optional(),
  payments: z.boolean().default(false).optional()
})

export const updateCurrencySettingsSchema = z.object({
  currency: z.string().min(1, { message: 'Debes seleccionar una moneda' })
})

export const updateAlertSizeSettingsSchema = z.object({
  size: z.string().min(1, { message: 'Debes seleccionar un tamaño' })
})

export const createGroupFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del grupo tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre del grupo no puede tener más de 32 caracteres' }),
  description: z.string().max(255, { message: 'La descripción del grupo no puede tener más de 255 caracteres' }),
  icon: z.string().min(1, { message: 'Debes seleccionar un ícono' })
})

export const updateThemeSettingsSchema = z.object({
  theme: z.string().min(1, { message: 'Debes seleccionar un tema' })
})

export const giveAdminPermissionSchema = z.object({
  userId: z.string().min(1, { message: 'Debes seleccionar un usuario' })
})

export const updateGroupFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre del grupo tiene que tener al menos 2 caracteres' }).max(32, { message: 'El nombre del grupo no puede tener más de 32 caracteres' }),
  description: z.string().max(255, { message: 'La descripción del grupo no puede tener más de 255 caracteres' })
})

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: 'Debe ser un correo electrónico válido' })
})

export const generateInvitationLinkSchema = z.object({
  maxUses: z.coerce.number().int().min(1, { message: 'El número de usos no puede ser menor a 1' }).max(100, { message: 'El número de usos no puede ser mayor a 100' })
})
