import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { Student } from '../../models/student.model';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-students',
  imports: [NgFor, CommonModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.scss',
})
export class AllStudentsComponent {
  apiService = inject(ApiService);
  students = signal<Student[]>([]);

  page = signal(0);
  isLast = signal(false);
  studentToDelete?: Student;
  studentToEdit?: Student;
  filterForm = new FormGroup({
    count: new FormControl(0),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    studentClass: new FormControl(''),
    score: new FormControl(''),
    status: new FormControl(''),
    dateOfBirth: new FormControl(null),
  });

  editStudentForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    studentClass: new FormControl(''),
    status: new FormControl(''),
  });

  ngOnInit() {
    this.getAllStudents();
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
    const { firstName, lastName, status, studentClass } = this.studentToEdit;
    this.editStudentForm.setValue({
      firstName,
      lastName,
      status,
      studentClass,
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

  getAllStudents() {
    const { firstName, lastName, studentClass } = this.filterForm.value;
    this.apiService
      .get('student/', {
        page: this.page(),
        firstName,
        lastName,
        studentClass,
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

  editStudentInfo(payload: Student) {
    this.apiService.put(`student/${payload?.studentId}`, payload).subscribe({
      next: (response: any) => {
        this.students.set(
          this.students().map((s: Student) => {
            if (s.studentId == payload.studentId) {
              return payload;
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
}
