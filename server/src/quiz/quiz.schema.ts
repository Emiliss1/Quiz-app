import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  difficulty: string;

  @Prop({ type: [Object] })
  questions: object[];
}

export const quizSchema = SchemaFactory.createForClass(Quiz);
