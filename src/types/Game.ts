import { User } from './User'

export interface Move {
  move: string; move_number: number
}

export interface Game<UserOrSTring> {
  _id: string
  white_player: UserOrSTring
  black_player: UserOrSTring
  moves: Move[]
  created_at: string,
  updated_at: string,
  id: string
  __v: number
}
