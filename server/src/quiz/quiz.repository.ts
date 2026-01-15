import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { Model } from 'mongoose';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizFindDto } from './dto/quiz-find.dto';
import { QuizCompleteDto } from './dto/quiz-complete.dto';
import { User, UserDocument } from 'src/auth/user.schema';
import { QuizRemoveDto } from './dto/quiz-remove.dto';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createQuiz(quizCreateDto: QuizCreateDto): Promise<void> {
    const { title, difficulty, questions } = quizCreateDto;

    const quiz = new this.quizModel({
      title,
      difficulty,
      questions,
    });

    if (!quiz) {
      throw new NotFoundException('quiz doesnt exist');
    }

    quiz.save();
  }

  async getQuizzes(): Promise<Quiz[]> {
    const foundQuizzes = await this.quizModel.find({}).lean();

    if (!foundQuizzes) {
      throw new NotFoundException('quizzes not found');
    }

    return foundQuizzes;
  }

  async getQuiz(quizFindDto: QuizFindDto): Promise<Quiz> {
    const { id } = quizFindDto;

    const foundQuiz = await this.quizModel.findOne({ _id: id });

    if (!foundQuiz) {
      throw new NotFoundException('quiz was not found');
    }

    return foundQuiz;
  }

  async completeQuiz(
    user: User,
    quizCompleteDto: QuizCompleteDto,
  ): Promise<void> {
    const { points } = quizCompleteDto;

    const foundUser = await this.userModel.findOne({ _id: user._id });

    if (!foundUser) throw new NotFoundException('user was not found');

    if (foundUser.points < 0) {
      foundUser.points = 0;
    } else {
      foundUser.points += points;
    }

    foundUser.save();
  }

  async removeQuiz(quizRemoveDto: QuizRemoveDto): Promise<void> {
    const { _id } = quizRemoveDto;

    if (!_id) throw new NotFoundException('quiz was not found');

    await this.quizModel.deleteOne({ _id });
  }
}
