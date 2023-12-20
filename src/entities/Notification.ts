import { uuid } from 'uuidv4'

import {
  prop,
  index,
  Severity,
  modelOptions,
  defaultClasses,
  getModelForClass,
} from '@typegoose/typegoose'

@index({ player_id: 1 })
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Notification extends defaultClasses.TimeStamps {
  @prop({ default: () => uuid() })
  public _id: string

  @prop({ required: true })
  public player_id: string

  @prop({ required: true })
  public message: string

  @prop({ required: false })
  public game_id: string

  @prop({ required: false })
  public opened: boolean
}

export const NotificationModel = getModelForClass(Notification)
