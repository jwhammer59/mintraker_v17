import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { FamilyId } from '../../models/family-id';
import { FamilyIDService } from '../../services/family-id.service';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import {
  PrimeNGConfig,
  MessageService,
  ConfirmationService,
  ConfirmEventType,
} from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-family-id',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    TableModule,
    TooltipModule,
    ToastModule,
  ],
  templateUrl: './family-id.component.html',
  styleUrl: './family-id.component.scss',
})
export class FamilyIdComponent implements OnInit {
  headerTitle = signal('Family ID Table');
  headerIcon = signal('pi pi-fw pi-table');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Family ID');
  headerBtnIcon = signal('pi pi-fw pi-plus');

  private familyIdService = inject(FamilyIDService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private primengConfig = inject(PrimeNGConfig);

  allFamilyIds$!: Observable<FamilyId[]>;

  loading: boolean = true;
  searchValue: string | undefined;

  constructor() {
    this.allFamilyIds$ = this.familyIdService.getFamilyIds();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loading = false;
  }

  goToAddFamilyId() {
    this.ngZone.run(() => {
      this.router.navigate(['add-family-id']);
    });
  }

  goToEditFamilyId(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-family-id/${id}`]);
    });
  }

  goToFamilyIdDetail(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`family-id-detail/${id}`]);
    });
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
        this.familyIdService.deleteFamilyId(id);
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
