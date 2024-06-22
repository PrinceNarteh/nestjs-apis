import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
  constructor() {}

  private students = [
    { name: 'John', age: 20, GPA: 3.5 },
    { name: 'Jane', age: 21, GPA: 3.6 },
    { name: 'Doe', age: 22, GPA: 3.7 },
  ];

  async getAllStudents() {
    return this.students;
  }
}
