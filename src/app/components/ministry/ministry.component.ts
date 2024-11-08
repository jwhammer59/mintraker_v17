import { Component, OnInit, signal, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { MinistryTableComponent } from './table/ministry-table.component';

import { Ministry } from '../../models/ministry';
import { MinistriesService } from '../../services/ministries.service';

import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig } from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-ministry',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MinistryTableComponent,
    CardModule,
    ConfirmDialogModule,
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
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private primengConfig = inject(PrimeNGConfig);

  ministries$!: Observable<Ministry[]>;
  ministryIdToEdit: string = '';

  constructor() {
    this.ministries$ = this.ministriesService.getMinistries();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  goToAddMinistry() {
    this.ngZone.run(() => {
      this.router.navigate(['add-ministry']);
    });
  }

  goToEditMinistry(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-ministry/${id}`]);
    });
  }
}
