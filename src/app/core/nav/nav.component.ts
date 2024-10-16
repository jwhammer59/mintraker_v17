import { Component, inject, OnDestroy, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnDestroy {
  navTitle = input('Ministries Tracker Pro');
  navLogo = input('mtp.png');

  auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription!: Subscription;

  loggedInStatus = signal(false);
  loggedInUser!: string | null;
  loggedInUserId = signal('');

  loggedInItems: MenuItem[] = [
    {
      label: 'Log Out',
      icon: 'pi pi-fw pi-sign-out',
      command: (event) => {
        this.logOut();
      },
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-objects-column',
      routerLink: ['dashboard'],
    },
    {
      label: 'Members',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Members',
          icon: 'pi pi-fw pi-users',
          routerLink: ['members'],
        },
        {
          label: 'Add Member',
          icon: 'pi pi-fw pi-user-plus',
          routerLink: ['add-member'],
        },
      ],
    },
    {
      label: 'Ministries',
      icon: 'pi pi-fw pi-heart',
      items: [
        {
          label: 'Ministires',
          icon: 'pi pi-fw pi-heart',
          routerLink: ['ministries'],
        },
        {
          label: 'Ministry',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['add-ministry'],
        },
      ],
    },

    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Family IDs',
          icon: 'pi pi-fw pi-id-card',
          items: [
            {
              label: 'Family IDs',
              icon: 'pi pi-fw pi-id-card',
              routerLink: ['family-ids'],
            },
            {
              label: 'Add Family ID',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['add-family-id'],
            },
          ],
        },
        {
          label: 'Providers',
          icon: 'pi pi-fw pi-shield',
          items: [
            {
              label: 'Providers',
              icon: 'pi pi-fw pi-shield',
              routerLink: ['providers'],
            },
            {
              label: 'Add Provider',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['add-provider'],
            },
          ],
        },
      ],
    },
  ];

  loggedOutItems: MenuItem[] = [
    {
      label: 'Login',
      icon: 'pi pi-fw pi-sign-in',
      routerLink: ['login'],
    },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authStateSubscription = this.authState$.subscribe(
      (aUser: User | null) => {
        if (aUser) {
          this.loggedInUser = aUser.email;
          this.loggedInUserId.set(aUser.uid);
          this.loggedInStatus.set(true);
        }
      }
    );
  }

  logOut() {
    this.loggedInUser = '';
    this.loggedInStatus.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }
}
