import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HeadToolBarNav } from "../../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";

@Component({
  selector: 'app-maintenance-page',
  imports: [MatButtonModule, RouterLink, HeadToolBarNav],
  templateUrl: './maintenance-page.html',
  styleUrl: './maintenance-page.scss',
})
export class MaintenancePage {}
