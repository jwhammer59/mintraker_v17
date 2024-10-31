import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';
import { AddMinistryComponent } from './add-ministry/add-ministry.component';
import { EditMinistryComponent } from './edit-ministry/edit-ministry.component';
import { MinistryTableComponent } from './table/ministry-table.component';

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

import { PrimeNGConfig } from 'primeng/api';

import { Observable } from 'rxjs';

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
    MinistryTableComponent,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    ToastModule,
  ],
  templateUrl: './ministry.component.html',
  styleUrl: './ministry.component.scss',
})
export class MinistryComponent implements OnInit {
  headerTitle = signal('Minstries');
  headerIcon = signal('pi pi-fw pi-heart');
  headerLogo = signal('mtp.png');
  headerBtnIcon = signal('pi pi-fw pi-plus');
  headerBtnLabel = signal('Add New Ministry');
  headerBtnVisible = signal(true);

  private ministriesService = inject(MinistriesService);
  private primengConfig = inject(PrimeNGConfig);

  ministries$!: Observable<Ministry[]>;
  ministryIdToEdit: string = '';

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
    this.ministryIdToEdit = id;
    this.editMinistryDialog.set(true);
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
    if (type === 'cancel-edit') {
      this.editMinistryDialog.set(false);
    }
  }
}
