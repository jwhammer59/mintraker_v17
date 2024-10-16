import { Component, Output, EventEmitter, input } from '@angular/core';

import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, ToolbarModule, TooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title = input('');
  icon = input('');
  logo = input('');
  buttonLabel = input('');
  buttonIcon = input('');
  buttonVisible = input(false);

  @Output() buttonAction = new EventEmitter<string>();

  headerBtnAction() {
    this.buttonAction.emit();
  }
}
