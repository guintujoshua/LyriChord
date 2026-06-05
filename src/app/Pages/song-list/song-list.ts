import { Component } from '@angular/core';
import { HeadToolBarNav } from "../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { GeneralFooter } from "../../SharedPages/general-footer/general-footer";

@Component({
  selector: 'app-song-list',
  imports: [HeadToolBarNav, GeneralFooter],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss',
})
export class SongList {}
