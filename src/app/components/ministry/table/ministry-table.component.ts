import {
  Component,
  OnInit,
  signal,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Ministry } from '../../../models/ministry';
import { MinistriesService } from '../../../services/ministries.service';

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
  selector: 'app-ministry-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './ministry-table.component.html',
  styleUrl: './ministry-table.component.scss',
})
export class MinistryTableComponent implements OnInit {
  @Output() openEditMinistry = new EventEmitter<string>();

  private ministriesService = inject(MinistriesService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private primengConfig = inject(PrimeNGConfig);

  ministries$!: Observable<Ministry[]>;

  constructor() {
    this.ministries$ = this.ministriesService.getMinistries();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onOpenEditMinistry(id: string) {
    this.openEditMinistry.emit(id);
  }

  onDeleteMinistry(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Ministry Deleted!!',
        });
        this.ministriesService.deleteMinistry(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Ministry deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Ministry deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
