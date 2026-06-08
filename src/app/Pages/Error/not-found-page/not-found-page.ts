import { Component } from '@angular/core';
import { GeneralFooter } from "../../../SharedPages/general-footer/general-footer";
import { HeadToolBarNav } from "../../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-not-found-page',
  imports: [GeneralFooter, HeadToolBarNav, MatIconModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {}
