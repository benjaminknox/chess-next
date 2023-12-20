import { uuid } from 'uuidv4'
import { prop, plugin, getModelForClass } from '@typegoose/typegoose'

export class GameMove {
  @prop({ required: true })
  public move: string
  @prop({ required: true })
  public move_number: number
}

export const GameMoveModel = getModelForClass(GameMove)
