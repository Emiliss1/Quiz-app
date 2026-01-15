import { IsNotEmpty, IsString } from 'class-validator';

export class QuizFindDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
