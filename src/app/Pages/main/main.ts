import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HeadToolBarNav } from "../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { GeneralFooter } from "../../SharedPages/general-footer/general-footer";

@Component({
  selector: 'app-main',
  imports: [MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, HeadToolBarNav, GeneralFooter],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
