import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { ProviderType } from '../../../models/provider-type';
import { PROVIDER_TYPE } from '../../../data/provider-type-data';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    CardModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
  ],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.scss',
})
export class AddProviderComponent implements OnInit {
  headerTitle = signal('Add Provider');
  headerIcon = signal('pi pi-fw pi-plus');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Add Provider Form');

  submitted = signal(false);

  private providersService = inject(ProvidersService);
  private messageService = inject(MessageService);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;
  providerTypes: ProviderType[] = PROVIDER_TYPE;

  addProviderForm!: FormGroup;

  allProviders: Provider[] = [];
  allProviderNames: string[] = [];
  selectedProviderName: string = '';

  constructor() {
    this.addProviderForm = this.fb.group({
      providerNameId: ['', [Validators.required, Validators.minLength(5)]],
      providerFullName: ['', [Validators.required, Validators.minLength(5)]],
      providerPhone: ['', Validators.required],
      providerEmail: ['', Validators.required],
      providerAdd1: ['', Validators.required],
      providerAdd2: '',
      providerCity: ['', Validators.required],
      providerState: ['', Validators.required],
      providerZip: ['', Validators.required],
      providerType: ['', Validators.required],
      providerIsActive: true,
    });

    this.providersService.getProviders().subscribe((providers) => {
      this.allProviders = providers;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getProviderNames();
  }

  get f() {
    return this.addProviderForm.controls;
  }

  getProviderNameIdMessage() {
    return this.f['providerNameId'].hasError('required')
      ? 'You must enter a name'
      : this.f['providerNameId'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getProviderFullNameMessage() {
    return this.f['providerFullName'].hasError('required')
      ? 'You must enter a name'
      : this.f['providerFullName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getProviderNames() {
    setTimeout(() => {
      this.allProviders.filter((provider) =>
        this.allProviderNames.push(provider.providerNameId)
      );
    }, 1000);
  }

  onSubmit({ value, valid }: { value: Provider; valid: boolean }) {
    this.selectedProviderName = value.providerNameId;
    this.submitted.set(true);

    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        key: 'error',
        life: 2000,
      });
    } else if (this.allProviderNames.includes(value.providerNameId)) {
      const tempProviderName = this.selectedProviderName;
      this.selectedProviderName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempProviderName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.providersService.addProvider(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Provider Added!',
        key: 'success',
        life: 2000,
      });
    }
  }

  onCancelAddProvider() {
    this.addProviderForm.reset();
    this.goToProviders();
  }

  goToProviders() {
    this.ngZone.run(() => {
      this.router.navigate(['providers']);
    });
  }

  goBack() {
    this.location.back();
  }
}
