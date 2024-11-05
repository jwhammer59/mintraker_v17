import { Component, OnInit, NgZone, inject, signal } from '@angular/core';
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

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

import { State } from '../../../models/state';
import { STATES } from '../../../data/state-data';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { PrimeNGConfig, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-member',
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
    InputMaskModule,
    InputTextModule,
    PickListModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
})
export class AddMemberComponent implements OnInit {
  headerTitle = signal('Add Member');
  headerIcon = signal('pi pi-fw pi-user-plus');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');
  cardHeader = signal('Add Family ID Form');
  submitted = signal(false);

  private membersService = inject(MembersService);
  private familyIdService = inject(FamilyIDService);
  private ministriesService = inject(MinistriesService);
  private providersService = inject(ProvidersService);
  private messageService = inject(MessageService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private primengConfig = inject(PrimeNGConfig);

  states: State[] = STATES;

  allFamilyIds$!: Observable<FamilyId[]>;
  allMinistries$!: Observable<Ministry[]>;
  allProviders$!: Observable<Provider[]>;
  allMembers$!: Observable<Member[]>;
  allMembersArray: Member[] = [];
  memberNameArray: string[] = [];
  selectedMemberName: string = '';

  onlyDoctors$!: Observable<Provider[]>;
  onlyDentists$!: Observable<Provider[]>;
  onlyHospitals$!: Observable<Provider[]>;

  addMemberForm!: FormGroup;

  sourceMinistries: Ministry[] = [];
  targetMinistries: Ministry[] = [];

  showAddMinistriesDialog = signal(false);
  showAddMedicalDialog = signal(false);

  constructor() {
    this.allFamilyIds$ = this.familyIdService.getFamilyIds();
    this.allMinistries$ = this.ministriesService.getMinistries();
    this.allProviders$ = this.providersService.getProviders();
    this.allMembers$ = this.membersService.getMembers();

    // Add Ministries to PickList
    this.ministriesService.getMinistries().subscribe((data) => {
      this.sourceMinistries = data;
    });

    this.addMemberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleInit: '',
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      fullName: '',
      familyId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      add1: ['', Validators.required],
      add2: '',
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      ministries: [],
      doctor: ['', Validators.required],
      dentist: ['', Validators.required],
      hospital: ['', Validators.required],
      isActive: false,
      isHeadOfFamily: false,
      canBeMinistryHead: false,
    });

    this.membersService.getMembers().subscribe((member) => {
      this.allMembersArray = member;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    setTimeout(() => {
      this.processProviders();
      this.processMemberName(this.allMembersArray);
    }, 2000);
  }

  processProviders() {
    this.onlyDentists$ = this.allProviders$.pipe(
      map((providers) =>
        providers.filter((provider) => provider.providerType === 'Dentist')
      )
    );

    this.onlyDoctors$ = this.allProviders$.pipe(
      map((providers) =>
        providers.filter((provider) => provider.providerType === 'Doctor')
      )
    );

    this.onlyHospitals$ = this.allProviders$.pipe(
      map((providers) =>
        providers.filter((provider) => provider.providerType === 'Hospital')
      )
    );
  }

  processMemberName(data: Member[]) {
    this.memberNameArray = [];
    data.map((el) => this.memberNameArray.push(el.firstName + el.lastName));
  }

  get f() {
    return this.addMemberForm.controls;
  }

  getFirstNameMessage() {
    return this.f['firstName'].hasError('required')
      ? 'First Name Required.'
      : this.f['firstName'].hasError('minlength')
      ? 'Min length 3 characters'
      : '';
  }

  getLastNameMessage() {
    return this.f['lastName'].hasError('required')
      ? 'Last Name Required.'
      : this.f['lastName'].hasError('minlength')
      ? 'Min length 3 characters'
      : '';
  }

  checkForFullName() {
    if (this.f['firstName'].value === '' || this.f['lastName'].value === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'First and Last Name Required before Family ID can be selected',
        life: 3000,
        key: 'error',
      });
    } else {
      let tempFullName =
        this.f['firstName'].value + ' ' + this.f['lastName'].value;
      this.f['fullName'].setValue(tempFullName);
    }
  }

  onSubmit({ value, valid }: { value: Member; valid: boolean }) {
    this.submitted.set(true);
    this.selectedMemberName = value.firstName + value.lastName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (this.memberNameArray.includes(this.selectedMemberName)) {
      const tempMemberName = value.firstName + ' ' + value.lastName;
      this.selectedMemberName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempMemberName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.membersService.addMember(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Member Added!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goBack() {
    this.location.back();
  }

  goToMembers() {
    this.ngZone.run(() => {
      this.router.navigate(['members']);
    });
  }

  onCancelAddMember() {
    this.addMemberForm.reset();
    this.goToMembers();
  }

  sendToMinistriesTarget() {
    this.f['ministries'].setValue(this.targetMinistries);
  }

  sendToMinistriesSource() {
    this.f['ministries'].setValue(this.targetMinistries);
  }

  onOpenMinsitriesDialog() {
    this.showAddMinistriesDialog.set(true);
  }

  onCloseAddMinistriesDialog() {
    this.showAddMinistriesDialog.set(false);
  }

  onCancelMinistryDialog() {
    this.f['ministries'].setValue([]);
    this.onCloseAddMinistriesDialog();
  }

  onOpenAddMedicalDialog() {
    this.showAddMedicalDialog.set(true);
  }

  onCloseAddMedicalDialog() {
    this.showAddMedicalDialog.set(false);
  }

  onCancelMedicalDialog() {
    this.f['doctor'].setValue('');
    this.f['dentist'].setValue('');
    this.f['hospital'].setValue('');
    this.onCloseAddMedicalDialog();
  }
}
