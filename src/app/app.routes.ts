import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllStudentsComponent } from './components/all-students/all-students.component';
import { StudentChangeLogsComponent } from './components/student-change-logs/student-change-logs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'allStudents', component: AllStudentsComponent },
      { path: 'logs', component: StudentChangeLogsComponent },
    ],
  },

  { path: '', component: HomeComponent, canActivate: [authGuard] },
];
