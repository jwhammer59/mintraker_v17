import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingService } from '../../services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
