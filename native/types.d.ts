export type LoginResponse = UserResponse | ErrorResponse
export type Token = string
export interface UserResponse {
  token: Token
  user: User
  message?: string
}

export interface ErrorResponse {
  message: string
}

export type Roles = "ADMIN" | "TEACHER"

export interface User {
  id: number
  uuid: string
  name: string
  email: string
  password: string
  role: Roles
  number: string
  createdAt: String 
  updatedAt: String
}