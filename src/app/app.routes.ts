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
    path: 'family-ids',
    loadComponent: () =>
      import('./components/familyId/family-id.component').then(
        (m) => m.FamilyIdComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-family-id',
    loadComponent: () =>
      import(
        './components/familyId/add-family-id/add-family-id.component'
      ).then((m) => m.AddFamilyIdComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-family-id/:id',
    loadComponent: () =>
      import(
        './components/familyId/edit-family-id/edit-family-id.component'
      ).then((m) => m.EditFamilyIdComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'family-id-detail/:id',
    loadComponent: () =>
      import(
        './components/familyId/family-id-detail/family-id-detail.component'
      ).then((m) => m.FamilyIdDetailComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'providers',
    loadComponent: () =>
      import('./components/provider/provider.component').then(
        (m) => m.ProviderComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-provider',
    loadComponent: () =>
      import('./components/provider/add-provider/add-provider.component').then(
        (m) => m.AddProviderComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-provider/:id',
    loadComponent: () =>
      import(
        './components/provider/edit-provider/edit-provider.component'
      ).then((m) => m.EditProviderComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'provider-detail/:id',
    loadComponent: () =>
      import(
        './components/provider/provider-detail/provider-detail.component'
      ).then((m) => m.ProviderDetailComponent),
    canActivate: [AuthGuard],
  },
];
