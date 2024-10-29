import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';
import { AddMinistryComponent } from './add-ministry/add-ministry.component';
import { EditMinistryComponent } from './edit-ministry/edit-ministry.component';

import { Ministry } from '../../models/ministry';
import { MinistriesService } from '../../services/ministries.service';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import {
  PrimeNGConfig,
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ministry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    AddMinistryComponent,
    EditMinistryComponent,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './ministry.component.html',
  styleUrl: './ministry.component.scss',
})
export class MinistryComponent implements OnInit {
  headerTitle = signal('Minstries');
  headerIcon = signal('pi pi-fw pi-heart');
  headerLogo = signal('mtp.png');

  private ministriesService = inject(MinistriesService);
  private primengConfig = inject(PrimeNGConfig);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ministries$!: Observable<Ministry[]>;
  ministry!: Ministry;
  selectedMinistries$!: Observable<Ministry[]>;

  newMinistryDialog = signal(false);
  editMinistryDialog = signal(false);

  constructor() {
    this.ministries$ = this.ministriesService.getMinistries();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  openNewMinistry() {
    this.newMinistryDialog.set(true);
  }

  openEditMinistry(id: string) {
    console.log(id);
    this.editMinistryDialog.set(true);
  }

  deleteSelectedMinistries() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected ministrys?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedMinistries$ = this.ministries$.pipe(
          map((ministries) =>
            ministries.filter((ministry) => ministry.id === 'Physician')
          )
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Minstries Deleted',
          life: 3000,
        });
      },
    });
  }

  editMinistry(ministry: Ministry) {}

  deleteMinistry(id: string) {
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

  hideDialog(type: string) {
    if (type === 'add') {
      this.newMinistryDialog.set(false);
    }
    if (type === 'edit') {
      this.editMinistryDialog.set(false);
    }
    if (type === 'cancel-add') {
      console.log('Cancel Add');
      this.newMinistryDialog.set(false);
    }
  }
}
