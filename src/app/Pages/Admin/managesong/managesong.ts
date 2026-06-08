import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';
import { AddEditDeleteSong, AdminSongRecord, SongDialogData, SongDialogResult } from '../add-edit-delete-song/add-edit-delete-song';

@Component({
  selector: 'app-managesong',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './managesong.html',
  styleUrl: './managesong.scss',
})
export class Managesong {
  readonly displayedColumns = ['title', 'artist', 'key', 'year', 'status', 'actions'];

  songs: AdminSongRecord[] = [
    {
      id: 1,
      title: 'Lilim',
      artist: 'Victory Worship',
      key: 'E',
      year: 2016,
      status: 'Active',
      lyricsWithChords: '[E]Mananatili sa iyong [G#m]lilim',
    },
    {
      id: 2,
      title: 'Safe',
      artist: 'Victory Worship',
      key: 'G',
      year: 2018,
      status: 'Active',
      lyricsWithChords: '[G]You are my safe place, [D]my strong tower',
    },
    {
      id: 3,
      title: 'Radical Love',
      artist: 'Victory Worship',
      key: 'D',
      year: 2016,
      status: 'Inactive',
      lyricsWithChords: '[D]Your radical love has rescued me',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openAddDialog(): void {
    this.openDialog({ mode: 'add' });
  }

  openEditDialog(song: AdminSongRecord): void {
    this.openDialog({ mode: 'edit', song });
  }

  openDeleteDialog(song: AdminSongRecord): void {
    this.openDialog({ mode: 'delete', song });
  }

  private openDialog(data: SongDialogData): void {
    this.dialog
      .open(AddEditDeleteSong, {
        width: '640px',
        maxWidth: '95vw',
        maxHeight: '92vh',
        data,
      })
      .afterClosed()
      .subscribe((result?: SongDialogResult) => {
        if (!result?.song) {
          return;
        }

        if (result.mode === 'add') {
          const nextId = this.songs.length ? Math.max(...this.songs.map((item) => item.id)) + 1 : 1;
          this.songs = [...this.songs, { ...result.song, id: nextId }];
          return;
        }

        if (result.mode === 'edit') {
          this.songs = this.songs.map((item) => (item.id === result.song!.id ? result.song! : item));
          return;
        }

        this.songs = this.songs.map((item) => {
          if (item.id !== result.song!.id) {
            return item;
          }

          return {
            ...item,
            status: item.status === 'Active' ? 'Inactive' : 'Active',
          };
        });
      });
  }
}
