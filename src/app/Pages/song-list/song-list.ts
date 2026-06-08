import { AfterViewInit, Component, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeadToolBarNav } from "../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { GeneralFooter } from "../../SharedPages/general-footer/general-footer";
import { RouterModule } from '@angular/router';
import { SONGS, SongItem } from '../../song-data';

@Component({
  selector: 'app-song-list',
  imports: [HeadToolBarNav, GeneralFooter, MatTableModule, MatPaginator, MatInputModule, MatFormFieldModule, RouterModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss',
})
export class SongList implements AfterViewInit {
 displayedColumns: string[] = ['title', 'artist', 'album', 'year'];

  songs: SongItem[] = SONGS;

  dataSource = new MatTableDataSource(this.songs);

  readonly paginator = viewChild.required(MatPaginator);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}