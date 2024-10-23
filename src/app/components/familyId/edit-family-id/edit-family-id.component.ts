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

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

import { LoadingService } from '../../../services/loading.service';

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
  selector: 'app-edit-family-id',
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
  templateUrl: './edit-family-id.component.html',
  styleUrl: './edit-family-id.component.scss',
})
export class EditFamilyIdComponent implements OnInit {
  headerTitle = signal('Edit Family ID');
  headerIcon = signal('pi pi-fw pi-pencil');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Edit Family ID Form');

  submitted = signal(false);

  private familyIdService = inject(FamilyIDService);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;

  id: string = '';

  editFamilyIdForm!: FormGroup;
  familyIdRef: any;

  allFamilyIds: FamilyId[] = [];
  allFamilyIdNames: string[] = [];
  selectedFamilyIdName: string = '';
  editingFamilyIdName: string = '';

  constructor() {
    this.editFamilyIdForm = this.fb.group({
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

    this.familyIdService.getFamilyIds().subscribe((familyIds) => {
      this.allFamilyIds = familyIds;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.familyIdService.getFamilyId(this.id).subscribe((data) => {
      this.familyIdRef = data;
    });
    this.getFamilyIdNames();
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editFamilyIdForm = this.fb.group({
        familyIdName: [this.familyIdRef.familyIdName],
        familyIdFullName: [this.familyIdRef.familyIdFullName],
        familyIdPhone: [this.familyIdRef.familyIdPhone],
        familyIdEmail: [this.familyIdRef.familyIdEmail],
        familyIdAdd1: [this.familyIdRef.familyIdAdd1],
        familyIdAdd2: [this.familyIdRef.familyIdAdd2],
        familyIdCity: [this.familyIdRef.familyIdCity],
        familyIdState: [this.familyIdRef.familyIdState],
        familyIdZip: [this.familyIdRef.familyIdZip],
      });
      this.editingFamilyIdName = this.familyIdRef.familyIdName;
      this.loadingService.loadingOff();
    }, 2000);
  }

  get f() {
    return this.editFamilyIdForm.controls;
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
    } else if (
      this.editingFamilyIdName !== this.selectedFamilyIdName &&
      this.allFamilyIdNames.includes(value.familyIdName)
    ) {
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
      this.familyIdService.updateFamilyId(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Family ID Updated!',
        key: 'success',
        life: 2000,
      });
    }
  }

  onCancelEditFamilyId() {
    this.editFamilyIdForm.reset();
    this.goToFamilyIds();
  }

  goToFamilyIds() {
    this.ngZone.run(() => {
      this.router.navigate(['family-ids']);
    });
  }

  goBack() {
    this.location.back();
  }
}
