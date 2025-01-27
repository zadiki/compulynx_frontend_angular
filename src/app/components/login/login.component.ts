import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../actions/user.action';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  router = inject(Router);
  apiService = inject(ApiService);
  store = inject(Store);

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    localStorage.removeItem('authToken');
    const { username: userName, password } = this.loginForm.value;
    const loginPayload = { userName, password };
    this.apiService.post('user/login', loginPayload).subscribe({
      next: (response: any) => {
        const user: User = {
          userId: response?.user?.id,
          username: response?.user?.userName,
        };
        this.store.dispatch(loginSuccess(user));
        Swal.fire({
          title: `Hello ${user.username}`,
          text: 'you have logged in successfully',
          icon: 'success',
        });
        localStorage.setItem('authToken', response.jwt);

        this.router.navigate(['/home']);
      },
      error: (err?) => {
        console.error(err);
        Swal.fire({
          title: `Loggin error`,
          text: 'you have error logging in',
          icon: 'error',
        });
      },
    });
  }
}
