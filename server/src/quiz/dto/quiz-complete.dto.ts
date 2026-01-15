import { IsNumber } from 'class-validator';

export class QuizCompleteDto {
  @IsNumber()
  points: number;
}
