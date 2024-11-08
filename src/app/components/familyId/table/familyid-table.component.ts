import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

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
  selector: 'app-familyid-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './familyid-table.component.html',
  styleUrl: './familyid-table.component.scss',
})
export class FamilyidTableComponent implements OnInit {
  @Output() openEditFamilyId = new EventEmitter<string>();
  @Output() openFamilyIdDetails = new EventEmitter<string>();

  private familyIdsService = inject(FamilyIDService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private primengConfig = inject(PrimeNGConfig);

  familyIds$!: Observable<FamilyId[]>;

  constructor() {
    this.familyIds$ = this.familyIdsService.getFamilyIds();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onEditFamilyId(id: string) {
    this.openEditFamilyId.emit(id);
  }

  onFamilyIdDetails(id: string) {
    this.openFamilyIdDetails.emit(id);
  }

  onDeleteFamilyId(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Family ID Deleted!!',
        });
        this.familyIdsService.deleteFamilyId(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Family ID deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Family ID deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
