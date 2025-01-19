import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from '../actions/user.action';
import { initialUserLoginState } from '../models/user.model';

export const userReducer = createReducer(
  initialUserLoginState,
  on(loginSuccess, (state, user) => ({
    ...state,
    isLoggedIn: true,
    user,
  })),

  on(logout, () => initialUserLoginState) // Reset state on logout
);
