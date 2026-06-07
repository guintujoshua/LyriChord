import { AfterViewInit, Component, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeadToolBarNav } from "../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { GeneralFooter } from "../../SharedPages/general-footer/general-footer";

export interface Song {
  title: string;
  artist: string;
  album: string;
  year: number;
}

@Component({
  selector: 'app-song-list',
  imports: [HeadToolBarNav, GeneralFooter, MatTableModule, MatPaginator, MatInputModule, MatFormFieldModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss',
})
export class SongList implements AfterViewInit {
 displayedColumns: string[] = ['title', 'artist', 'album', 'year'];

  songs: Song[] = [
    {
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: 'Divide',
      year: 2017
    },
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      year: 2020
    },
    {
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      year: 2011
    },
    {
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: 'Divide',
      year: 2017
    },
    {
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      year: 2021
    },
    {
      title: 'Stay',
      artist: 'The Kid LAROI',
      album: 'F*CK LOVE 3',
      year: 2021
    }
  ];

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