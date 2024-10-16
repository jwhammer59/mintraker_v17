import { Component, inject, OnInit, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { HeaderComponent } from '../../../core/header/header.component';
import { CardComponent } from '../../../core/card/card.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    CardComponent,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  headerTitle = signal('Login Page');
  headerIcon = signal('pi pi-fw pi-sign-in');
  headerLogo = signal('assets/CMI_Logo.png');
  submitted = signal(false);

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  private messageService = inject(MessageService);
  private primengConfig = inject(PrimeNGConfig);

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);
    const rawForm = this.loginForm.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.code;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${this.errorMessage}`,
          life: 3000,
        });
      },
    });
  }
}
