import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { StudentLog } from '../../models/student.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { User } from '../../models/user.model';
import { Modal } from 'bootstrap';
import { isImageUrl, getMomentdateFrpmString } from '../../utils/util';

@Component({
  selector: 'app-student-change-logs',
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './student-change-logs.component.html',
  styleUrl: './student-change-logs.component.scss',
})
export class StudentChangeLogsComponent {
  router = inject(Router);
  apiService = inject(ApiService);
  studentLogs = signal<StudentLog[]>([]);
  logToEdit = signal<StudentLog | undefined>(undefined);
  store = inject(Store);
  systemUser = signal<User | undefined>(undefined);
  comment = signal('');
  isImageUrl = isImageUrl;
  getMomentdateFrpmString = getMomentdateFrpmString;
  ngOnInit() {
    this.store
      .select('user')
      .subscribe((value) => this.systemUser.set(value.user));
    this.fetchStudentLogs();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchStudentLogs();
      });
  }

  @ViewChild('rejectModal', { static: true }) rejectModal!: ElementRef;
  private rejectModalInstance: Modal | null = null;
  @ViewChild('approveModal', { static: true }) approveModal!: ElementRef;
  private approveModalInstance: Modal | null = null;

  openDiscardeModal(log: StudentLog) {
    this.logToEdit.set(log);
    this.rejectModalInstance = new Modal(this.rejectModal.nativeElement, {});
    this.rejectModalInstance.show();
  }
  openApproveModal(log: StudentLog) {
    this.logToEdit.set(log);
    this.approveModalInstance = new Modal(this.approveModal.nativeElement, {});
    this.approveModalInstance.show();
  }
  fetchStudentLogs() {
    this.apiService.get('logs').subscribe({
      next: (response: any) => {
        console.log(response);
        this.studentLogs.update((logs) => response);
      },
      error: (err: any) => {
        Swal.fire({
          title: `Error geting logs`,
          text: 'Loggs error.',
          icon: 'error',
        });
      },
    });
  }

  confirm(actionStatus: string = 'REJECTED') {
    this.approveStudentLog({
      ...this.logToEdit(),
      actionStatus,
      comment: this.comment(),
    });
    this.logToEdit.set(undefined);
  }

  approveStudentLog(payload: any) {
    this.apiService.put(`logs`, payload).subscribe({
      next: (response: any) => {
        this.studentLogs.set(
          this.studentLogs().map((s) => {
            if (s.id == response.id) return response;
            return s;
          })
        );
        this.closeAcceptModal();
        this.closeRejectModal();
        Swal.fire({
          title: `Changes Accepted`,
          text: 'Successfully accepted changes',
          icon: 'success',
        });
      },
      error: (err?: any) => {
        Swal.fire({
          title: `Acceptence   error`,
          text: 'Error approving changes',
          icon: 'error',
        });
      },
    });
  }

  closeAcceptModal() {
    this.approveModalInstance?.hide();
  }
  closeRejectModal() {
    this.rejectModalInstance?.hide();
  }
  onCommentChange(event: any) {
    this.comment.set(event.target?.value || 'no comment');
    console.log('New value = ' + this.comment());
  }
}
