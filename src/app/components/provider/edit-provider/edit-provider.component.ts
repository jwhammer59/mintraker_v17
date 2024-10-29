import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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

import { LoadingService } from '../../../services/loading.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { ProviderType } from '../../../models/provider-type';
import { PROVIDER_TYPE } from '../../../data/provider-type-data';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
  ],
  templateUrl: './edit-provider.component.html',
  styleUrl: './edit-provider.component.scss',
})
export class EditProviderComponent implements OnInit {
  headerTitle = signal('Edit Provider');
  headerIcon = signal('pi pi-fw pi-pencil');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Edit Provider Form');

  submitted = signal(false);

  private providersService = inject(ProvidersService);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);
  private primengConfig = inject(PrimeNGConfig);

  id: string = '';

  states: State[] = STATES;
  providerTypes: ProviderType[] = PROVIDER_TYPE;

  editProviderForm!: FormGroup;
  providerRef: any;

  allProviders: Provider[] = [];
  allProviderNames: string[] = [];
  selectedProviderName: string = '';
  editingProviderName: string = '';

  constructor() {
    this.editProviderForm = this.fb.group({
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
    this.id = this.route.snapshot.params['id'];

    this.providersService.getProvider(this.id).subscribe((provider) => {
      this.providerRef = provider;
    });
    this.getProviderNames();
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editProviderForm = this.fb.group({
        providerNameId: [this.providerRef.providerNameId],
        providerFullName: [this.providerRef.providerFullName],
        providerPhone: [this.providerRef.providerPhone],
        providerEmail: [this.providerRef.providerEmail],
        providerAdd1: [this.providerRef.providerAdd1],
        providerAdd2: [this.providerRef.providerAdd2],
        providerCity: [this.providerRef.providerCity],
        providerState: [this.providerRef.providerState],
        providerZip: [this.providerRef.providerZip],
        providerType: [this.providerRef.providerType],
        providerIsActive: [this.providerRef.providerIsActive],
      });
      this.editingProviderName = this.providerRef.providerNameId;
      this.loadingService.loadingOff();
    }, 2000);
  }

  get f() {
    return this.editProviderForm.controls;
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
    } else if (
      this.editingProviderName !== this.selectedProviderName &&
      this.allProviderNames.includes(value.providerNameId)
    ) {
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
      this.providersService.updateProvider(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Provider Updated!',
        key: 'success',
        life: 2000,
      });
    }
  }

  onCancelAddProvider() {
    this.editProviderForm.reset();
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
