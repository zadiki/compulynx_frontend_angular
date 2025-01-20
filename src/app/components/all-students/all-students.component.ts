import { Component, inject, signal } from '@angular/core';
import { Student } from '../../models/student.model';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-all-students',
  imports: [NgFor, CommonModule],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.scss',
})
export class AllStudentsComponent {
  apiService = inject(ApiService);
  students = signal<Student[]>([]);
  firstName = signal(null);
  lastName = signal(null);
  studentClass = signal(null);
  score = signal(null);
  status = signal(null);
  page = signal(1);
  isLast = signal(false);
  ngOnInit() {
    this.getAllStudents();
  }

  getAllStudents() {
    this.apiService
      .get('student/', {
        page: this.page(),
        firstName: this.firstName(),
        lastName: this.lastName(),
        studentClass: this.studentClass(),
      })
      .subscribe({
        next: (response: any) => {
          const { content: students, number } = response;
          this.students.set(students);
        },
        error: (err?: any) => {
          console.error(err);
          Swal.fire({
            title: `all student error`,
            text: 'Error geting students',
            icon: 'error',
          });
        },
      });
  }
}
