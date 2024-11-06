import { Component, OnInit, signal, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../../core/header/header.component';
import { BodyComponent } from '../../../core/body/body.component';
import { CardComponent } from '../../../core/card/card.component';

import { Member } from '../../../models/member';
import { MembersService } from '../../../services/members.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    CheckboxModule,
    ButtonModule,
    CardModule,
    TabViewModule,
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit {
  headerTitle = signal('Member Details');
  headerIcon = signal('pi pi-fw pi-exclamation-circle');
  headerLogo = signal('mtp.png');
  headerBtnVisible = signal(true);
  headerBtnLabel = signal('Back');
  headerBtnIcon = signal('pi pi-fw pi-arrow-circle-left');

  private membersService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private primengConfig = inject(PrimeNGConfig);

  id: string = '';

  member!: Member;
  ministryNameArray: string[] = [];

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];

    this.membersService.getMember(this.id).subscribe((member) => {
      this.member = member;
    });

    setTimeout(() => {
      this.processMinistries();
    }, 2000);
  }

  processMinistries() {
    if (this.member.ministries.length > 0) {
      this.member.ministries.filter((item) =>
        this.ministryNameArray.push(item.ministryName)
      );
    }
  }

  goBackToMembers() {
    this.location.back();
  }
}
