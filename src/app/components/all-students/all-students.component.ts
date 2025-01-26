import {
  Component,
  ElementRef,
  inject,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { format } from 'date-fns';

import { Student } from '../../models/student.model';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SelectedStudentsComponent } from '../selected-students/selected-students.component';
import { AverageScoreComponent } from '../average-score/average-score.component';

@Component({
  selector: 'app-all-students',
  imports: [
    NgFor,
    CommonModule,
    DatePickerModule,
    CalendarModule,
    ReactiveFormsModule,
    SelectedStudentsComponent,
    AverageScoreComponent,
  ],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.scss',
})
export class AllStudentsComponent {
  apiService = inject(ApiService);
  router = inject(Router);
  students = signal<Student[]>([]);
  selectedStdents = signal<Student[]>([]);
  page = signal(0);
  isLast = signal(false);
  studentToDelete?: Student;
  studentToEdit?: Student;
  editImageUrl: string = '';

  filterForm = new FormGroup({
    count: new FormControl(0),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    studentClass: new FormControl(''),
    score: new FormControl(''),
    pendingTask: new FormControl(2),
    status: new FormControl(''),
    dateOfBirth: new FormControl(null),
  });
  photoToUpload?: File;
  editStudentForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    studentClass: new FormControl(''),
    status: new FormControl(''),
    score: new FormControl(0),
    dateOfBirth: new FormControl(new Date()),
  });

  ngOnInit() {
    this.getAllStudents();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.filterForm.reset();
        this.getAllStudents();
      });
  }

  @ViewChild('deleteModal', { static: true }) deleteElement!: ElementRef;
  @ViewChild('editModal', { static: true }) editElement!: ElementRef;

  private deleteModalInstance: Modal | null = null;
  private editModalInstance: Modal | null = null;

  openDeleteModal(student: Student) {
    this.studentToDelete = student;
    this.deleteModalInstance = new Modal(this.deleteElement.nativeElement, {});
    this.deleteModalInstance.show();
  }

  closeDeleteModal() {
    this.deleteModalInstance?.hide();
  }

  openEditModal(student: Student) {
    this.studentToEdit = student;
    this.editImageUrl = student.photoPath;
    this.photoToUpload = undefined;
    const { firstName, lastName, status, studentClass, score, dateOfBirth } =
      this.studentToEdit;
    this.editStudentForm.setValue({
      firstName,
      lastName,
      status,
      studentClass,
      score,
      dateOfBirth,
    });
    this.editModalInstance = new Modal(this.editElement.nativeElement, {});
    this.editModalInstance.show();
  }

  closeEditModal() {
    this.editModalInstance?.hide();
  }

  onEditSubmit() {
    let p: Student = {
      ...this.studentToEdit,
      ...this.editStudentForm.value,
    } as Student;
    this.editStudentInfo(p);
  }

  onNextClicked() {
    this.page.set(this.page() + 1);
    this.getAllStudents();
  }
  onPreviousClicked() {
    this.page() > 0 && this.page.set(this.page() - 1);
    this.getAllStudents();
  }
  onfilterSubmited() {
    this.getAllStudents();
  }

  addStudent(student: Student) {
    this.selectedStdents.update((current) => [...current, student]);
  }

  checkIfStudentIsSelected(student: Student) {
    return this.selectedStdents().some(
      (s) => s.studentId === student.studentId
    );
  }

  removeStudent(student: Student) {
    this.selectedStdents.update((current) =>
      current.filter((c) => c.studentId != student.studentId)
    );
  }
  getAllStudents() {
    const {
      firstName,
      lastName,
      studentClass,
      status,
      dateOfBirth,
      pendingTask,
    } = this.filterForm.value;
    this.apiService
      .get('student/', {
        page: this.page(),
        firstName,
        lastName,
        studentClass,
        status,
        pendingTask,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
      })
      .subscribe({
        next: (response: any) => {
          const { content: students, number, last } = response;
          this.students.set(students);
          this.isLast.set(last);
          this.page.set(number);
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

  onConfirmDeleteStudent(student?: Student) {
    this.apiService.delete(`student/${student?.studentId}`).subscribe({
      next: (response: any) => {
        this.students.set(
          this.students().filter((s) => s.studentId !== student?.studentId)
        );
        this.closeDeleteModal();
        Swal.fire({
          title: `Deletion success`,
          text: 'Successfully deleted student',
          icon: 'success',
        });
      },
      error: (err?: any) => {
        Swal.fire({
          title: `delete  error`,
          text: 'Error deleting student',
          icon: 'error',
        });
      },
    });
  }

  editStudentInfo(payload: any) {
    let path = `student/${payload?.studentId}`;
    if (payload.dateOfBirth) {
      const formattedDateOfBirth = format(
        payload.dateOfBirth,
        'yyyy-MM-dd HH:mm:ss'
      );
      payload.dateOfBirth = formattedDateOfBirth;
    }

    let body;
    if (this.photoToUpload) {
      body = new FormData();
      body.append('image', this.photoToUpload);
      body.append('studentData', JSON.stringify(payload));
      path = `student/upload/${payload?.studentId}`;
    } else {
      body = payload;
    }

    this.apiService.put(path, body).subscribe({
      next: (response: any) => {
        this.students.set(
          this.students().map((s: Student) => {
            if (s.studentId == payload.studentId) {
              return response as Student;
            } else {
              return s;
            }
          })
        );
        this.closeEditModal();
        Swal.fire({
          title: `Updated`,
          text: 'Successfully Updated student',
          icon: 'success',
        });
      },
      error: (err?: any) => {
        Swal.fire({
          title: `Updated  error`,
          text: 'Error updateing student',
          icon: 'error',
        });
      },
    });
  }

  onStudentPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: `Updated  error`,
          text: 'File size exceeds 5MB. Please choose a smaller file.',
          icon: 'error',
        });
        input.value = ''; // Reset the file input
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: `Updated  error`,
          text: 'Invalid file type. Please select a PNG or JPEG image.',
          icon: 'error',
        });
        input.value = ''; // Reset the file input
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.editImageUrl = reader.result as string;
        // Set the preview image
      };
      reader.readAsDataURL(file);
      this.photoToUpload = file;
    }
  }
  onExportExcelClicked() {
    this.apiService.getExcel('student/excel').subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${new Date().toISOString()}-students.xlsx`; // Suggested filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        Swal.fire({
          title: `Error geting excel`,
          text: 'Fcould not get excel.',
          icon: 'error',
        });
        console.error('Error downloading the file', err);
      },
    });
  }
}
