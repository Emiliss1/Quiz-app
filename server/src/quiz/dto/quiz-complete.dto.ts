import { IsNumber, IsString } from 'class-validator';

export class QuizCompleteDto {
  @IsNumber()
  points: number;

  @IsString()
  quizId: string;
}
