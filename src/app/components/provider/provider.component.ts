import { Component, OnInit, NgZone, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../core/header/header.component';
import { BodyComponent } from '../../core/body/body.component';
import { CardComponent } from '../../core/card/card.component';

import { ProviderTableComponent } from './table/provider-table.component';

import { Provider } from '../../models/provider';
import { ProvidersService } from '../../services/providers.service';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig } from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    ProviderTableComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss',
})
export class ProviderComponent implements OnInit {
  headerTitle = signal('Provider Table');
  headerIcon = signal('pi pi-fw pi-table');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Add Provider');
  headerBtnIcon = signal('pi pi-fw pi-plus');

  private providersService = inject(ProvidersService);
  private ngZone = inject(NgZone);
  private router = inject(Router);
  private primengConfig = inject(PrimeNGConfig);

  allProviders$!: Observable<Provider[]>;

  loading: boolean = true;
  searchValue: string | undefined;

  constructor() {
    this.allProviders$ = this.providersService.getProviders();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loading = false;
  }

  goToAddProvider() {
    this.ngZone.run(() => {
      this.router.navigate(['add-provider']);
    });
  }

  goToEditProvider(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-provider/${id}`]);
    });
  }

  goToProviderDetail(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`provider-detail/${id}`]);
    });
  }
}
