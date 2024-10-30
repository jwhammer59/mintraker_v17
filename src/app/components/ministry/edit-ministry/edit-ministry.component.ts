import {
  Component,
  OnInit,
  signal,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

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

import { PrimeNGConfig, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-ministry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './edit-ministry.component.html',
  styleUrl: './edit-ministry.component.scss',
})
export class EditMinistryComponent implements OnInit {
  @Input() ministryId: string = '';
  @Output() closeDialog = new EventEmitter<string>();

  private ministriesService = inject(MinistriesService);
  private membersService = inject(MembersService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageService);
  private primengConfig = inject(PrimeNGConfig);
  private fb = inject(FormBuilder);

  allMinistriesArray: Ministry[] = [];
  ministryNameArray: string[] = [];
  selectedMinistryName: string = '';
  editingMinistryName: string = '';

  ministry!: Ministry;
  allMembers$!: Observable<Member[]>;
  onlyMemberChairs$!: Observable<Member[]>;
  ministryRef: any;

  submitted = signal(false);

  editMinistryForm!: FormGroup;

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
    console.log(this.ministryId);
    this.primengConfig.ripple = true;
    this.getMemberChairs();

    this.ministriesService.getMinistry(this.ministryId).subscribe((data) => {
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
      this.ministriesService.updateMinistry(this.ministryId, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Ministry Updated',
        life: 3000,
        key: 'editSuccess',
      });
    }

    this.editMinistryForm.reset();
  }

  hideDialog() {
    this.editMinistryForm.reset();
    this.closeDialog.emit('cancel-edit');
  }
}
