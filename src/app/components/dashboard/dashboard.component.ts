import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { Student } from '../../models/student.model';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  apiService = inject(ApiService);
  students = signal<Student[]>([]);
  generateStudentsForm = new FormGroup({
    count: new FormControl(0),
  });
  ngOnInit() {}

  onClickGenerateCsv() {
    this.apiService.get('student/generateStudentsCSV').subscribe({
      next: (response: any) => {
        Swal.fire({
          title: `Csv success`,
          text: 'you have generated csv successfully',
          icon: 'success',
        });
      },
      error: (err?) => {
        console.error(err);
        Swal.fire({
          title: `CSV error`,
          text: 'Error generating csv',
          icon: 'error',
        });
      },
    });
  }
  onClickSaveStudents() {
    this.apiService.get('student/saveGeneratedStudents').subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err?) => {
        console.error(err);
        alert('error saving students');
      },
    });
  }

  onSubmit() {
    const { count } = this.generateStudentsForm.value;
    this.apiService.get('student/generateStudentsExcel', { count }).subscribe({
      next: (response: any) => {
        this.students.set(response);
        console.log(this.students());
        Swal.fire({
          title: `Students generated `,
          text: `you have successfully generated ${count} students`,
          icon: 'success',
        });
      },
      error: (err?) => {
        console.error(err);
        Swal.fire({
          title: 'generation error',
          text: 'error generating students',
          icon: 'error',
        });
      },
    });
  }
}
