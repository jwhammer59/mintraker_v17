import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import {
  PrimeNGConfig,
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './member-table.component.html',
  styleUrl: './member-table.component.scss',
})
export class MemberTableComponent implements OnInit {
  @Output() openEditMember = new EventEmitter<string>();

  private membersService = inject(MembersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private primengConfig = inject(PrimeNGConfig);

  members$!: Observable<Member[]>;

  constructor() {
    this.members$ = this.membersService.getMembers();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onEditMember(id: string) {
    this.openEditMember.emit(id);
  }

  onDeleteMember(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Member Deleted!!',
        });
        this.membersService.deleteMember(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Member deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Member deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
