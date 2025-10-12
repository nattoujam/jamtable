export type User = {
  id: number
  name: string
}

export type Room = {
  id: number
  name: string
  users: Array<User>
}

export type Chat = {
  userName: string
  message: string
  timestamp: number
}
