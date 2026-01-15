import { ArrayMaxSize, IsString, MaxLength, maxLength } from 'class-validator';

export class QuizCreateDto {
  @IsString()
  title: string;

  @IsString()
  difficulty: string;

  @ArrayMaxSize(30)
  questions: string[];
}
