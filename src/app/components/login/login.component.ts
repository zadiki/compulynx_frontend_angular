import { Component, signal } from '@angular/core';
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
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private router: Router,
    private apiService: ApiService,
    private store: Store
  ) {}
  onSubmit() {
    const { username: userName, password } = this.loginForm.value;
    const loginPayload = { userName, password };
    this.apiService.post('user/login', loginPayload).subscribe({
      next: (response: any) => {
        const user: User = {
          userId: 1,
          username: 'zadiki',
        };
        this.store.dispatch(loginSuccess(user));
      },
      error: (err?) => {
        console.error(err);
        alert('Login failed!');
      },
    });
    this.router.navigate(['/home']);
  }
}
