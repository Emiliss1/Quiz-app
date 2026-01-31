import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Quiz } from './quiz.schema';
import { QuizFindDto } from './dto/quiz-find.dto';
import { QuizCompleteDto } from './dto/quiz-complete.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { QuizRemoveDto } from './dto/quiz-remove.dto';

@Controller('quiz')
@UseGuards(AuthGuard(), RolesGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Roles(Role.ADMIN)
  @Post('/create')
  createQuiz(@Body() quizCreateDto: QuizCreateDto): Promise<void> {
    return this.quizService.createQuiz(quizCreateDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('/quizzes')
  getQuizzes(@GetUser() user: User): Promise<Quiz[]> {
    return this.quizService.getQuizzes(user);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get('/getquiz/:id')
  getQuiz(
    @GetUser() user: User,
    @Param() quizFindDto: QuizFindDto,
  ): Promise<Quiz> {
    return this.quizService.getQuiz(user, quizFindDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Post('/completequiz')
  completeQuiz(
    @GetUser() user: User,
    @Body() quizCompleteDto: QuizCompleteDto,
  ): Promise<void> {
    return this.quizService.completeQuiz(user, quizCompleteDto);
  }

  @Roles(Role.ADMIN)
  @Post('/removequiz')
  removeQuiz(@Body() quizRemoveDto: QuizRemoveDto): Promise<void> {
    return this.quizService.removeQuiz(quizRemoveDto);
  }
}
