import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateExamDto, CreateExamSessionDto, CreateSubmissionDto } from "./dtos/createExam.dto";
import { ExamService } from "./exam.service";

@Controller("exam")
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post("/create")
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }

  @Get("/all")
  getAllExams() {
    return this.examService.getAllExams();
  }

  @Post("/session")
  @UsePipes(ValidationPipe)
  async createExamSession(@Body() data: CreateExamSessionDto) {
    try {
      return await this.examService.startOrResumeExam(
        data.userId,
        data.examId,
        data.currentQuestionId
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("/submit")
  @UsePipes(ValidationPipe)
  submitQuestionAnswer(@Body() data: CreateSubmissionDto) {
    return this.examService.submitQuestionAnswer(data);
  }

  @Post("/finish")
  submitOrFinishExam(@Body() data: { examSessionId: string }) {
    return this.examService.submitOrFinishExam(data.examSessionId);
  }

  @Get("/result")
  getExamResult(@Query("userId") userId: string, @Query("examId") examId: string) {
    return this.examService.getExamResultByExamId(userId, examId);
  }
}
