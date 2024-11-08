import { Component, OnInit, signal, inject, NgZone } from '@angular/core';
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
  selector: 'app-edit-ministry',
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
  templateUrl: './edit-ministry.component.html',
  styleUrl: './edit-ministry.component.scss',
})
export class EditMinistryComponent implements OnInit {
  headerTitle = signal('Edit Ministry');
  headerIcon = signal('pi pi-fw pi-user-pencil');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Edit Ministry Form');
  submitted = signal(false);

  private ministriesService = inject(MinistriesService);
  private membersService = inject(MembersService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);

  allMinistriesArray: Ministry[] = [];
  ministryNameArray: string[] = [];
  selectedMinistryName: string = '';
  editingMinistryName: string = '';

  ministry!: Ministry;
  allMembers$!: Observable<Member[]>;
  onlyMemberChairs$!: Observable<Member[]>;

  editMinistryForm!: FormGroup;
  ministryRef: any;
  id: string = '';

  constructor() {
    this.ministriesService.getMinistries().subscribe((ministries) => {
      this.allMinistriesArray = ministries;
    });
    this.allMembers$ = this.membersService.getMembers();
    this.editMinistryForm = this.fb.group({
      ministryName: ['', [Validators.required, Validators.minLength(4)]],
      ministryChair: '',
      ministryIsActive: false,
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.getMemberChairs();

    this.ministriesService.getMinistry(this.id).subscribe((data) => {
      this.ministryRef = data;
    });

    setTimeout(() => {
      this.processMinistryNameArray(this.allMinistriesArray);
    }, 2000);
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editMinistryForm = this.fb.group({
        ministryName: [this.ministryRef.ministryName],
        ministryChair: [this.ministryRef.ministryChair],
        ministryIsActive: [this.ministryRef.ministryIsActive],
      });
      this.editingMinistryName = this.ministryRef.ministryName;
      this.loadingService.loadingOff();
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
    }, 2000);
  }

  get f() {
    return this.editMinistryForm.controls;
  }

  onSubmit({ value, valid }: { value: Ministry; valid: boolean }) {
    this.selectedMinistryName = value.ministryName;

    this.submitted.set(true);
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form is Invalid',
        life: 2000,
      });
    } else if (
      this.editingMinistryName !== this.selectedMinistryName &&
      this.ministryNameArray.includes(this.selectedMinistryName)
    ) {
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
      this.ministriesService.updateMinistry(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Ministry Updated',
        life: 3000,
        key: 'success',
      });
    }

    this.editMinistryForm.reset();
  }

  onCancelEditMinistry() {
    this.editMinistryForm.reset();
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
