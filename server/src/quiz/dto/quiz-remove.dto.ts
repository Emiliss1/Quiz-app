import { IsString } from 'class-validator';

export class QuizRemoveDto {
  @IsString()
  _id: string;
}
