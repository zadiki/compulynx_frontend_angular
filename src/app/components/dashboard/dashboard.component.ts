import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  apiService = inject(ApiService);
  studentList: Student[] = signal([]);
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
        this.studentList.set(response);
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
