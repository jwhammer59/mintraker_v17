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

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

import { LoadingService } from '../../../services/loading.service';

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
  selector: 'app-edit-member',
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
  templateUrl: './edit-member.component.html',
  styleUrl: './edit-member.component.scss',
})
export class EditMemberComponent {
  headerTitle = signal('Edit Member');
  headerIcon = signal('pi pi-fw pi-user-pencil');
  headerLogo = signal('mtp.png');

  cardHeader = signal('Edit Family ID Form');
  submitted = signal(false);

  private membersService = inject(MembersService);
  private familyIdService = inject(FamilyIDService);
  private ministriesService = inject(MinistriesService);
  private providersService = inject(ProvidersService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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
  editingMemberName: string = '';

  onlyDoctors$!: Observable<Provider[]>;
  onlyDentists$!: Observable<Provider[]>;
  onlyHospitals$!: Observable<Provider[]>;

  editMemberForm!: FormGroup;
  memberRef: any;
  id: string = '';

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

    this.editMemberForm = this.fb.group({
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
    this.id = this.route.snapshot.params['id'];

    this.membersService.getMember(this.id).subscribe((member) => {
      this.memberRef = member;
    });

    setTimeout(() => {
      this.processProviders();
      this.processMemberName(this.allMembersArray);
    }, 2000);
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editMemberForm = this.fb.group({
        firstName: [this.memberRef.firstName],
        middleInit: [this.memberRef.middleInit],
        lastName: [this.memberRef.lastName],
        fullName: [this.memberRef.fullName],
        familyId: [this.memberRef.familyId],
        phone: [this.memberRef.phone],
        email: [this.memberRef.email],
        add1: [this.memberRef.add1],
        add2: [this.memberRef.add2],
        city: [this.memberRef.city],
        state: [this.memberRef.state],
        zip: [this.memberRef.zip],
        ministries: [this.memberRef.ministries],
        doctor: [this.memberRef.doctor],
        dentist: [this.memberRef.dentist],
        hospital: [this.memberRef.hospital],
        isActive: [this.memberRef.isActive],
        isHeadOfFamily: [this.memberRef.isHeadOfFamily],
        canBeMinistryHead: [this.memberRef.canBeMinistryHead],
      });
      this.editingMemberName = this.memberRef.fullName;
      this.targetMinistries = this.editMemberForm.controls['ministries'].value;
      this.processSourceMinistries();
      this.loadingService.loadingOff();
    }, 2000);
  }

  processSourceMinistries() {
    // Remove id's from Volunteers current ministry list
    let ministriesToFilter: string[] = this.targetMinistries.map(
      (ministry) => ministry.id!
    );

    // Filter Source Ministiries to only include ministries that are
    // not already belonging to volunteer
    let tempMinistires = this.sourceMinistries.filter((ministry) => {
      return ministriesToFilter.indexOf(ministry.id!) == -1;
    });
    // Set Source Ministries in Form
    this.sourceMinistries = tempMinistires;
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
    return this.editMemberForm.controls;
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
    this.selectedMemberName = value.firstName + ' ' + value.lastName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (
      this.editingMemberName !== this.selectedMemberName &&
      this.memberNameArray.includes(this.selectedMemberName)
    ) {
      console.log(this.editingMemberName, this.selectedMemberName);
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
      this.membersService.updateMember(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Member Updated!',
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
    this.editMemberForm.reset();
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
