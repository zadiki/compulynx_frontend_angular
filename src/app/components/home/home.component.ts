import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from '../../actions/user.action';

import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userName = signal('');
  router = inject(Router);
  store = inject(Store);
  apiService = inject(ApiService);

  ngOnInit() {
    this.store
      .select('user')
      .subscribe((value) => this.userName.set(value.user?.username || ''));
  }
  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
