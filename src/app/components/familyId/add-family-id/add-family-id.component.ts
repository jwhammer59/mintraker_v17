import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
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

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-family-id',
  standalone: true,
  imports: [
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
  templateUrl: './add-family-id.component.html',
  styleUrl: './add-family-id.component.scss',
})
export class AddFamilyIdComponent implements OnInit {
  headerTitle = signal('Add Family ID');
  headerIcon = signal('pi pi-fw pi-plus');
  headerLogo = signal('mtp.png');

  cardHeader = signal('Add Family ID Form');

  submitted = signal(false);

  private familyIdService = inject(FamilyIDService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;

  addFamilyIdForm!: FormGroup;

  allFamilyIds: FamilyId[] = [];
  allFamilyIdNames: string[] = [];
  selectedFamilyIdName: string = '';

  constructor() {
    this.addFamilyIdForm = this.fb.group({
      familyIdName: ['', [Validators.required, Validators.minLength(5)]],
      familyIdFullName: ['', [Validators.required, Validators.minLength(5)]],
      familyIdPhone: ['', Validators.required],
      familyIdEmail: ['', Validators.required],
      familyIdAdd1: ['', Validators.required],
      familyIdAdd2: '',
      familyIdCity: ['', Validators.required],
      familyIdState: ['', Validators.required],
      familyIdZip: ['', Validators.required],
    });

    this.familyIdService
      .getFamilyIds()
      .subscribe((familyIds) => (this.allFamilyIds = familyIds));
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getFamilyIdNames();
  }

  get f() {
    return this.addFamilyIdForm.controls;
  }

  getFamilyIdNameMessage() {
    return this.f['familyIdName'].hasError('required')
      ? 'You must enter a name'
      : this.f['familyIdName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getFamilyIdFullNameMessage() {
    return this.f['familyIdFullName'].hasError('required')
      ? 'You must enter a name'
      : this.f['familyIdFullName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getFamilyIdNames() {
    setTimeout(() => {
      this.allFamilyIds.filter((familyId) =>
        this.allFamilyIdNames.push(familyId.familyIdName)
      );
    }, 1000);
  }

  onSubmit({ value, valid }: { value: FamilyId; valid: boolean }) {
    this.selectedFamilyIdName = value.familyIdName;
    this.submitted.set(true);

    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        key: 'error',
        life: 2000,
      });
    } else if (this.allFamilyIdNames.includes(value.familyIdName)) {
      const tempFamilyNameId = this.selectedFamilyIdName;
      this.selectedFamilyIdName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempFamilyNameId} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.familyIdService.addFamilyId(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Family ID Added!',
        key: 'success',
        life: 2000,
      });
    }
  }

  onCancelAddFamilyId() {
    this.addFamilyIdForm.reset();
    this.goToFamilyIds();
  }

  goToFamilyIds() {
    this.ngZone.run(() => {
      this.router.navigate(['family-ids']);
    });
  }
}
