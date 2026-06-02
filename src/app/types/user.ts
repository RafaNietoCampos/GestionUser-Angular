import type { USER_ROLE } from '@app/constants/user-role'

export type User = {
  id: number
  name: string
  role: UserRole
  dni: string
  address: string
  phone: string
  email: string
  active: boolean
  createDate: Date
}

export type CreateUser = Omit<User, 'id' | 'createDate'> & {
  password: string
}

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE]
