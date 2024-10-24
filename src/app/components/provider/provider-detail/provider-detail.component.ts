import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { Provider } from '../../../models/provider';
import { ProvidersService } from '../../../services/providers.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-provider-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ButtonModule,
    CardModule,
    CheckboxModule,
  ],
  templateUrl: './provider-detail.component.html',
  styleUrl: './provider-detail.component.scss',
})
export class ProviderDetailComponent implements OnInit {
  headerTitle = signal('Provider Details');
  headerIcon = signal('pi pi-fw pi-exclamation-circle');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  cardHeader = signal('Details');

  provider!: Provider;

  id: string = '';

  private providersService = inject(ProvidersService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.providersService.getProvider(this.id).subscribe((data) => {
      this.provider = data;
    });
  }

  goBack() {
    this.location.back();
  }
}
