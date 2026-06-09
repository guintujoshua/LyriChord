import { AfterViewInit, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeadToolBarNav } from "../../SharedPages/head-tool-bar-nav/head-tool-bar-nav";
import { GeneralFooter } from "../../SharedPages/general-footer/general-footer";
import { RouterModule } from '@angular/router';
import { SongService, Song } from '../../services/song.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-song-list',
  imports: [HeadToolBarNav, GeneralFooter, MatTableModule, MatPaginator, MatInputModule, MatFormFieldModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss',
})
export class SongList implements OnInit, AfterViewInit {
  private readonly songService = inject(SongService);
  displayedColumns: string[] = ['title', 'artist', 'album', 'year'];

  songs = signal<Song[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  dataSource = new MatTableDataSource<Song>();

  readonly paginator = viewChild.required(MatPaginator);

  ngOnInit() {
    this.loadSongs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
  }

  loadSongs(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.songs.set(data);
        this.dataSource.data = data;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load songs:', err);
        this.error.set('Failed to load songs. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}