export interface User {
  token?: string;
  username: string;
  userId: number;
}

export interface UserLoginState {
  isLoggedIn: boolean;
  user?: User;
}
export const initialUserLoginState: UserLoginState = {
  isLoggedIn: false,
};
