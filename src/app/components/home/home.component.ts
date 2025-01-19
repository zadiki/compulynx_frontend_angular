import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from '../../actions/user.action';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userName = signal('');
  router = inject(Router);
  store = inject(Store);
  apiService = inject(ApiService);
  generateStudentsForm = new FormGroup({
    count: new FormControl(0),
  });
  ngOnInit() {
    this.store
      .select('user')
      .subscribe((value) => this.userName.set(value.user?.username || ''));
  }
  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
  onSubmit() {
    const { count } = this.generateStudentsForm.value;
    this.apiService.get('student/generateStudentsExcel', { count }).subscribe({
      next: (response: any) => {
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
}
