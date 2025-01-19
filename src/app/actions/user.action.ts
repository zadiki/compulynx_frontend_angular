import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const loginSuccess = createAction('USER_LOGIN_SUCCESS', props<User>());

export const logout = createAction('USER_LOGOUT');
