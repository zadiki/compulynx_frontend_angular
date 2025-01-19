import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from '../../actions/user.action';

import { UserLoginState } from '../../models/user.model';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userName = signal('');
  router = inject(Router);
  store = inject(Store);
  ngOnInit() {
    console.log('here');
    this.store
      .select('user')
      .subscribe((value) => this.userName.set(value.user?.username || ''));
  }
  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
