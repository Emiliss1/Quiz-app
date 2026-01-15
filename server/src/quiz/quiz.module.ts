import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, quizSchema } from './quiz.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, userSchema } from 'src/auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: quizSchema },
      { name: User.name, schema: userSchema },
    ]),
    AuthModule,
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository],
})
export class QuizModule {}
