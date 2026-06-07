import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-head-tool-bar-nav',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './head-tool-bar-nav.html',
  styleUrl: './head-tool-bar-nav.scss',
})
export class HeadToolBarNav implements OnInit {

  isDark = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDark = prefersDark;

    document.documentElement.classList.toggle('dark-theme', this.isDark);
  }

  toggleDarkMode() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark-theme', this.isDark);
  }
}
