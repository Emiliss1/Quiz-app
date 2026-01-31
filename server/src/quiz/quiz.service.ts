import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { Quiz } from './quiz.schema';
import { QuizFindDto } from './dto/quiz-find.dto';
import { User } from 'src/auth/user.schema';
import { QuizCompleteDto } from './dto/quiz-complete.dto';
import { QuizRemoveDto } from './dto/quiz-remove.dto';
import { GetUser } from 'src/user/get-user.decorator';

@Injectable()
export class QuizService {
  constructor(private quizRepository: QuizRepository) {}

  async createQuiz(quizCreateDto: QuizCreateDto): Promise<void> {
    return this.quizRepository.createQuiz(quizCreateDto);
  }

  async getQuizzes(user: User): Promise<Quiz[]> {
    return this.quizRepository.getQuizzes(user);
  }

  async getQuiz(
    @GetUser() user: User,
    quizFindDto: QuizFindDto,
  ): Promise<Quiz> {
    return this.quizRepository.getQuiz(user, quizFindDto);
  }

  async completeQuiz(
    user: User,
    quizCompleteDto: QuizCompleteDto,
  ): Promise<void> {
    return this.quizRepository.completeQuiz(user, quizCompleteDto);
  }

  async removeQuiz(quizRemoveDto: QuizRemoveDto): Promise<void> {
    return this.quizRepository.removeQuiz(quizRemoveDto);
  }
}
