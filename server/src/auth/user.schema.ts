import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Role } from './roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ default: Role.USER })
  role: Role;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 0 })
  points: number;
}

export const userSchema = SchemaFactory.createForClass(User);
