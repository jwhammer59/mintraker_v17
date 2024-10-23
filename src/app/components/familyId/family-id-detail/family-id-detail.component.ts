import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { FamilyId } from '../../../models/family-id';
import { FamilyIDService } from '../../../services/family-id.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-family-id-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './family-id-detail.component.html',
  styleUrl: './family-id-detail.component.scss',
})
export class FamilyIdDetailComponent implements OnInit {
  headerTitle = signal('Family ID Details');
  headerIcon = signal('pi pi-fw pi-exclamation-circle');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Details');

  familyId!: FamilyId;

  id: string = '';

  private familyIdService = inject(FamilyIDService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.familyIdService.getFamilyId(this.id).subscribe((data) => {
      this.familyId = data;
    });
  }

  goBack() {
    this.location.back();
  }
}
