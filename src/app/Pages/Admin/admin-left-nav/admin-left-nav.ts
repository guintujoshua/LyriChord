import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-left-nav',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './admin-left-nav.html',
  styleUrl: './admin-left-nav.scss',
})
export class AdminLeftNav implements OnInit {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard',       route: '/admin' },
    { label: 'Songs',     icon: 'library_music',   route: '/admin/songs' },
    { label: 'Users',     icon: 'group',            route: '/admin/users' },
    { label: 'Settings',  icon: 'settings',         route: '/admin/settings' },
  ];

  isDark = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isDark = document.documentElement.classList.contains('dark-theme');
  }

  toggleTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark-theme', this.isDark);
  }
}
