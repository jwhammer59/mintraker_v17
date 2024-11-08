import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

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
  selector: 'app-provider-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './provider-table.component.html',
  styleUrl: './provider-table.component.scss',
})
export class ProviderTableComponent implements OnInit {
  @Output() openEditProvider = new EventEmitter<string>();
  @Output() openProviderDetails = new EventEmitter<string>();

  private providersService = inject(ProvidersService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private primengConfig = inject(PrimeNGConfig);

  providers$!: Observable<Provider[]>;

  constructor() {
    this.providers$ = this.providersService.getProviders();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onEditProvider(id: string) {
    this.openEditProvider.emit(id);
  }

  onProviderDetails(id: string) {
    this.openProviderDetails.emit(id);
  }

  onDeleteProvider(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Provider Deleted!!',
        });
        this.providersService.deleteProvider(id);
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Provider deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Provider deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
