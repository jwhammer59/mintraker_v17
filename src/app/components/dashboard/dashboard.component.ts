import { Component, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { MemberTableComponent } from '../member/table/member-table.component';
import { MinistryTableComponent } from '../ministry/table/ministry-table.component';
import { FamilyidTableComponent } from '../familyId/table/familyid-table.component';
import { ProviderTableComponent } from '../provider/table/provider-table.component';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MemberTableComponent,
    MinistryTableComponent,
    FamilyidTableComponent,
    ProviderTableComponent,
    CardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private ngZone = inject(NgZone);
  private router = inject(Router);

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

  goToEditMinistry(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-ministry/${id}`]);
    });
  }

  goToMinistryDetail(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`ministry-detail/${id}`]);
    });
  }
}
