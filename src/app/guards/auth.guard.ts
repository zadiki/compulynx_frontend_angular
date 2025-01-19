// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { UserLoginState } from '../models/user.model';

export const authGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select('user').pipe(
    take(1), // Ensure we only take the latest value once
    map((loginState: UserLoginState) => {
      if (loginState.isLoggedIn) {
        return true; // Allow access if token exists
      } else {
        router.navigate(['/login']); // Redirect to login if not authenticated
        return false;
      }
    })
  );
};
