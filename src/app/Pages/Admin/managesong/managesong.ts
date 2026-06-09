import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { finalize, timeout } from 'rxjs';
import { AdminLeftNav } from '../admin-left-nav/admin-left-nav';
import { GeneralFooter } from '../../../SharedPages/general-footer/general-footer';
import { AddEditDeleteSong, AdminSongRecord, SongDialogData, SongDialogResult } from '../add-edit-delete-song/add-edit-delete-song';
import { SongService, Song } from '../../../services/song.service';

@Component({
  selector: 'app-managesong',
  imports: [AdminLeftNav, GeneralFooter, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './managesong.html',
  styleUrl: './managesong.scss',
})
export class Managesong implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly songService = inject(SongService);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['title', 'artist', 'key', 'year', 'status', 'actions'];

  songs: AdminSongRecord[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadSongs();
  }

  loadSongs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.songService.getAllSongs().pipe(
      timeout(15000),
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe({
      next: (data: Song[]) => {
        this.songs = (Array.isArray(data) ? data : []).map((song) => this.toAdminSongRecord(song));
      },
      error: (err) => {
        console.error('Failed to load songs:', err);
        this.songs = [];
        if (err?.name === 'TimeoutError') {
          this.errorMessage = 'Loading songs timed out. Please check API connectivity and try again.';
        } else {
          this.errorMessage = err?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to load songs.';
        }
        this.snackBar.open('Failed to load songs', 'Close', { duration: 3000 });
      }
    });
  }

  private toAdminSongRecord(song: Partial<Song> | null | undefined): AdminSongRecord {
    const safeSong = song ?? {};
    const yearValue = safeSong.year ?? '';
    const parsedYear = typeof yearValue === 'number' ? yearValue : Number.parseInt(String(yearValue), 10);
    const lyrics = Array.isArray(safeSong.lyricsWithChords)
      ? safeSong.lyricsWithChords.filter((line): line is string => typeof line === 'string' && line.trim().length > 0)
      : [];

    return {
      id: Number(safeSong.id ?? 0),
      title: String(safeSong.title ?? ''),
      artist: String(safeSong.artist ?? ''),
      key: String(safeSong.key ?? ''),
      year: Number.isNaN(parsedYear) ? 0 : parsedYear,
      status: Boolean(safeSong.status) ? 'Active' : 'Inactive',
      lyricsWithChords: this.serializeLyricsCsv(lyrics),
    };
  }

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
          this.createSong(result.song);
          return;
        }

        if (result.mode === 'edit') {
          this.updateSong(result.song);
          return;
        }

        if (result.mode === 'delete') {
          this.deleteSong(result.song);
        }
      });
  }

  private createSong(song: AdminSongRecord): void {
    const lyrics = this.parseLyricsCsv(song.lyricsWithChords);

    this.songService.createSong({
      title: song.title,
      artist: song.artist,
      key: song.key,
      album: '',
      year: song.year.toString(),
      lyricsWithChords: lyrics,
      status: true
    }).subscribe({
      next: () => {
        this.snackBar.open('Song created successfully', 'Close', { duration: 3000 });
        this.loadSongs();
      },
      error: (err) => {
        console.error('Failed to create song:', err);
        this.snackBar.open('Failed to create song', 'Close', { duration: 3000 });
      }
    });
  }

  private updateSong(song: AdminSongRecord): void {
    const lyrics = this.parseLyricsCsv(song.lyricsWithChords);

    this.songService.updateSong(song.id, {
      title: song.title,
      artist: song.artist,
      key: song.key,
      album: '',
      year: song.year.toString(),
      lyricsWithChords: lyrics,
      status: song.status === 'Active'
    }).subscribe({
      next: () => {
        this.snackBar.open('Song updated successfully', 'Close', { duration: 3000 });
        this.loadSongs();
      },
      error: (err) => {
        console.error('Failed to update song:', err);
        this.snackBar.open('Failed to update song', 'Close', { duration: 3000 });
      }
    });
  }

  private parseLyricsCsv(value: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < value.length; index += 1) {
      const char = value[index];
      const nextChar = index + 1 < value.length ? value[index + 1] : '';

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        const parsed = current.trim();
        if (parsed.length > 0) {
          result.push(parsed);
        }
        current = '';
        continue;
      }

      current += char;
    }

    const last = current.trim();
    if (last.length > 0) {
      result.push(last);
    }

    return this.repairSplitLyrics(result);
  }

  private repairSplitLyrics(tokens: string[]): string[] {
    const repaired: string[] = [];

    for (const raw of tokens) {
      const token = raw.trim();
      if (!token) {
        continue;
      }

      const previous = repaired.length > 0 ? repaired[repaired.length - 1] : '';
      const tokenLooksLikeNewLine = token.startsWith('[');

      // If a plain text fragment was split by a comma, merge it back to the previous lyric line.
      if (!tokenLooksLikeNewLine && previous) {
        repaired[repaired.length - 1] = `${previous}, ${token}`;
        continue;
      }

      repaired.push(token);
    }

    return repaired;
  }

  private serializeLyricsCsv(values: string[]): string {
    return values
      .map((line) => this.escapeCsvField(line))
      .join(', ');
  }

  private escapeCsvField(value: string): string {
    const safe = String(value ?? '');
    const escaped = safe.replace(/"/g, '""');
    const needsQuotes = /[",\n\r]/.test(escaped);
    return needsQuotes ? `"${escaped}"` : escaped;
  }

  private deleteSong(song: AdminSongRecord): void {
    this.songService.deleteSong(song.id).subscribe({
      next: () => {
        this.snackBar.open('Song deleted successfully', 'Close', { duration: 3000 });
        this.loadSongs();
      },
      error: (err) => {
        console.error('Failed to delete song:', err);
        this.snackBar.open('Failed to delete song', 'Close', { duration: 3000 });
      }
    });
  }
}
