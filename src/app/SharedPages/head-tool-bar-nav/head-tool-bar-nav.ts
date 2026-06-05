import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-head-tool-bar-nav',
  imports: [MatToolbarModule,MatButtonModule,RouterLink],
  templateUrl: './head-tool-bar-nav.html',
  styleUrl: './head-tool-bar-nav.scss',
})
export class HeadToolBarNav {}
