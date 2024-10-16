import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';

import { AuthGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./components/member/member.component').then(
        (m) => m.MemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-member',
    loadComponent: () =>
      import('./components/member/add-member/add-member.component').then(
        (m) => m.AddMemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-member/:id',
    loadComponent: () =>
      import('./components/member/edit-member/edit-member.component').then(
        (m) => m.EditMemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'member-detail/:id',
    loadComponent: () =>
      import('./components/member/member-detail/member-detail.component').then(
        (m) => m.MemberDetailComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ministries',
    loadComponent: () =>
      import('./components/ministry/ministry.component').then(
        (m) => m.MinistryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-ministry',
    loadComponent: () =>
      import('./components/ministry/add-ministry/add-ministry.component').then(
        (m) => m.AddMinistryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-ministry/:id',
    loadComponent: () =>
      import(
        './components/ministry/edit-ministry/edit-ministry.component'
      ).then((m) => m.EditMinistryComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'ministry-detail/:id',
    loadComponent: () =>
      import(
        './components/ministry/ministry-detail/ministry-detail.component'
      ).then((m) => m.MinistryDetailComponent),
    canActivate: [AuthGuard],
  },
];
