import { uuid } from 'uuidv4'
import { GameMove } from '.'

import {
  prop,
  index,
  Severity,
  modelOptions,
  defaultClasses,
  getModelForClass,
} from '@typegoose/typegoose'

@index({ black_player: 1 })
@index({ white_player: 1 })
@index({ id: 1, createdAt: 1 })
@index({ id: 1 }, { unique: true })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Game extends defaultClasses.TimeStamps {
  @prop({ default: () => uuid() })
  public id: string

  @prop({ required: true })
  public white_player: string

  @prop({ required: true })
  public black_player: string

  @prop({ required: true })
  public moves: Array<GameMove>
}

export const GameModel = getModelForClass(Game)
