import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../actions/user.action';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  router = inject(Router);
  store = inject(Store);

  onLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
