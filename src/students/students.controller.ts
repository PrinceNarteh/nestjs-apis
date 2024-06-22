import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';

@UseInterceptors(CacheInterceptor)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @CacheTTL(30 * 1000)
  @Get()
  async getAllStudents() {
    return this.studentsService.getAllStudents();
  }
}
