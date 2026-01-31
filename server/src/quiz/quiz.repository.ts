import {
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { Model } from 'mongoose';
import { QuizCreateDto } from './dto/quiz-create.dto';
import { QuizFindDto } from './dto/quiz-find.dto';
import { QuizCompleteDto } from './dto/quiz-complete.dto';
import { User, UserDocument } from 'src/auth/user.schema';
import { QuizRemoveDto } from './dto/quiz-remove.dto';
import { Role } from 'src/auth/roles.enum';

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

  async getQuizzes(user: User): Promise<Quiz[]> {
    const foundQuizzes = await this.quizModel.find({}).lean();

    if (!foundQuizzes) {
      throw new NotFoundException('quizzes not found');
    }

    const foundUser = await this.userModel.findOne({ _id: user._id });

    if (!foundUser) {
      throw new NotFoundException('User was not found');
    }

    const newCompletedQuizzes = user.completed.filter((qId) => {
      if (foundQuizzes.some((quiz) => quiz._id === qId)) {
        return qId;
      } else {
        return;
      }
    });

    foundUser.completed = newCompletedQuizzes;

    foundUser.save();

    const filteredQuizzes = foundQuizzes.filter((quiz) => {
      if (user.completed.some((qId) => qId === quiz._id)) {
        return;
      } else {
        return quiz;
      }
    });

    console.log(filteredQuizzes);

    if (user.role === Role.ADMIN) {
      return foundQuizzes;
    } else {
      return filteredQuizzes;
    }
  }

  async getQuiz(user: User, quizFindDto: QuizFindDto): Promise<Quiz> {
    const { id } = quizFindDto;

    const foundQuiz = await this.quizModel.findOne({ _id: id });

    if (!foundQuiz) {
      throw new NotFoundException('quiz was not found');
    }

    if (user.completed.some((qId) => qId === foundQuiz._id)) {
      throw new ConflictException('you have already completed this quiz');
    }

    return foundQuiz;
  }

  async completeQuiz(
    user: User,
    quizCompleteDto: QuizCompleteDto,
  ): Promise<void> {
    const { points, quizId } = quizCompleteDto;

    const foundUser = await this.userModel.findOne({ _id: user._id });

    if (!foundUser) throw new NotFoundException('user was not found');

    if (user.completed.some((qId) => qId === quizId)) {
      throw new ConflictException('You have already completed this quiz');
    }

    if (foundUser.points < 0) {
      foundUser.points = 0;
    } else {
      foundUser.points += points;
    }

    foundUser.completed.push(quizId);

    foundUser.save();
  }

  async removeQuiz(quizRemoveDto: QuizRemoveDto): Promise<void> {
    const { _id } = quizRemoveDto;

    if (!_id) throw new NotFoundException('quiz was not found');

    await this.quizModel.deleteOne({ _id });
  }
}
