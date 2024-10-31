import { Component, OnInit, signal, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { MemberTableComponent } from './table/member-table.component';

import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { PrimeNGConfig } from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MemberTableComponent,
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss',
})
export class MemberComponent implements OnInit {
  headerTitle = signal('Members');
  headerIcon = signal('pi pi-fw pi-users');
  headerLogo = signal('mtp.png');
  headerBtnIcon = signal('pi pi-fw pi-user-plus');
  headerBtnLabel = signal('Add New Member');
  headerBtnVisible = signal(true);

  private membersService = inject(MembersService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private primengConfig = inject(PrimeNGConfig);

  members$!: Observable<Member[]>;
  memberToEdit: string = '';

  constructor() {
    this.members$ = this.membersService.getMembers();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  goToAddMember() {
    this.ngZone.run(() => {
      this.router.navigate(['add-member']);
    });
  }
}
