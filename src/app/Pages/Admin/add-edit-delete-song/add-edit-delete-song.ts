import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface AdminSongRecord {
  id: number;
  title: string;
  artist: string;
  key: string;
  year: number;
  status: string;
  lyricsWithChords: string;
}

export interface SongDialogData {
  mode: 'add' | 'edit' | 'delete';
  song?: AdminSongRecord;
}

export interface SongDialogResult {
  mode: 'add' | 'edit' | 'delete';
  song?: AdminSongRecord;
}

@Component({
  selector: 'app-add-edit-delete-song',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './add-edit-delete-song.html',
  styleUrl: './add-edit-delete-song.scss',
})
export class AddEditDeleteSong {
  readonly mode: 'add' | 'edit' | 'delete';

  readonly form;

  get isCurrentlyActive(): boolean {
    return this.data.song?.status === 'Active';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditDeleteSong, SongDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: SongDialogData,
  ) {
    this.mode = data.mode;

    this.form = this.fb.nonNullable.group({
      title: [data.song?.title ?? '', [Validators.required, Validators.maxLength(80)]],
      artist: [data.song?.artist ?? '', [Validators.required, Validators.maxLength(80)]],
      key: [data.song?.key ?? '', [Validators.required, Validators.maxLength(8)]],
      year: [data.song?.year?.toString() ?? '', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      status: [data.song?.status ?? 'Active', [Validators.required, Validators.maxLength(20)]],
      lyricsWithChords: [data.song?.lyricsWithChords ?? '', [Validators.required, Validators.maxLength(12000)]],
    });

    if (this.mode === 'delete') {
      this.form.disable();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.mode === 'delete') {
      this.dialogRef.close({ mode: 'delete', song: this.data.song });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: AdminSongRecord = {
      id: this.data.song?.id ?? 0,
      title: formValue.title.trim(),
      artist: formValue.artist.trim(),
      key: formValue.key.trim().toUpperCase(),
      year: Number(formValue.year),
      status: formValue.status.trim(),
      lyricsWithChords: formValue.lyricsWithChords.trim(),
    };

    this.dialogRef.close({ mode: this.mode, song: payload });
  }
}
