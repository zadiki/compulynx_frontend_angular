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

  filterForm = new FormGroup({
    count: new FormControl(0),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    studentClass: new FormControl(''),
    score: new FormControl(''),
    status: new FormControl(''),
    dateOfBirth: new FormControl(null),
  });

  ngOnInit() {
    this.getAllStudents();
  }

  @Output() confirm = new EventEmitter<any>();
  @ViewChild('deleteModal', { static: true }) modalElement!: ElementRef;

  private modalInstance: Modal | null = null;

  openModal(student: Student) {
    this.studentToDelete = student;
    this.modalInstance = new Modal(this.modalElement.nativeElement, {});
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance?.hide();
  }

  onConfirm() {
    this.confirm.emit('done');
    this.closeModal();
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
    this.apiService
      .get('student/', {
        page: this.page(),
        firstName: this.filterForm.value.firstName,
        lastName: this.filterForm.value.lastName,
        studentClass: this.filterForm.value.studentClass,
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
        this.closeModal();
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
}
