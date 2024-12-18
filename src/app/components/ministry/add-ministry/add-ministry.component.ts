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

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { LoadingService } from '../../../services/loading.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-ministry',
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
    DropdownModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './add-ministry.component.html',
  styleUrl: './add-ministry.component.scss',
})
export class AddMinistryComponent implements OnInit {
  headerTitle = signal('Add Ministry');
  headerIcon = signal('pi pi-fw pi-plus');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Add Ministry Form');

  private ministriesService = inject(MinistriesService);
  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
  private loadingService = inject(LoadingService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);
  private fb = inject(FormBuilder);

  allMinistriesArray: Ministry[] = [];
  ministryNameArray: string[] = [];
  selectedMinistryName: string = '';

  ministry!: Ministry;
  allMembers$!: Observable<Member[]>;
  onlyMemberChairs$!: Observable<Member[]>;

  submitted = signal(false);

  addMinistryForm!: FormGroup;

  constructor() {
    this.ministriesService.getMinistries().subscribe((ministries) => {
      this.allMinistriesArray = ministries;
    });
    this.allMembers$ = this.membersService.getMembers();
    this.addMinistryForm = this.fb.group({
      ministryName: ['', [Validators.required, Validators.minLength(4)]],
      ministryChair: '',
      ministryIsActive: false,
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loadingService.loadingOn();

    setTimeout(() => {
      this.getMemberChairs();
      this.processMinistryNameArray(this.allMinistriesArray);
    }, 2000);
  }

  processMinistryNameArray(data: Ministry[]) {
    this.ministryNameArray = [];
    data.map((el) => this.ministryNameArray.push(el.ministryName));
  }

  getMemberChairs() {
    setTimeout(() => {
      this.onlyMemberChairs$ = this.allMembers$.pipe(
        map((members) =>
          members.filter((member) => member.canBeMinistryHead === true)
        )
      );
      this.loadingService.loadingOff();
    }, 2000);
  }

  get f() {
    return this.addMinistryForm.controls;
  }

  onSubmit({ value, valid }: { value: Ministry; valid: boolean }) {
    this.selectedMinistryName = value.ministryName;
    this.submitted.set(true);
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form is Invalid',
        life: 3000,
      });
    } else if (this.ministryNameArray.includes(this.selectedMinistryName)) {
      const tempMinistryName = this.selectedMinistryName;
      this.selectedMinistryName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempMinistryName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.ministriesService.addMinistry(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Ministry Created',
        life: 3000,
        key: 'addSuccess',
      });
    }

    this.addMinistryForm.reset();
  }

  onCancelAddMinistry() {
    this.addMinistryForm.reset();
    this.goToMinistries();
  }

  goToMinistries() {
    this.ngZone.run(() => {
      this.router.navigate(['ministries']);
    });
  }

  goBack() {
    this.location.back();
  }
}
