import {
  Component,
  OnInit,
  signal,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { PrimeNGConfig, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-ministry',
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
  templateUrl: './add-ministry.component.html',
  styleUrl: './add-ministry.component.scss',
})
export class AddMinistryComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<string>();

  private ministriesService = inject(MinistriesService);
  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
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

  hideDialog() {
    console.log('Hide dialog');
    this.addMinistryForm.reset();
    this.closeDialog.emit('cancel-add');
  }
}
