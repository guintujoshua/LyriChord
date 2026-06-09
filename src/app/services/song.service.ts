import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Song {
  id: number;
  title: string;
  artist: string;
  key: string;
  album: string;
  year: string;
  lyricsWithChords: string[];
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SongService extends ApiService {
  private endpoint = `${this.apiUrl}/Song`;

  /**
   * Get all songs
   */
  getAllSongs(): Observable<Song[]> {
    return this.http.get<unknown>(this.endpoint).pipe(map((payload) => this.extractSongArray(payload)));
  }

  /**
   * Get a song by ID
   */
  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new song
   */
  createSong(song: Omit<Song, 'id'>): Observable<Song> {
    return this.http.post<Song>(this.endpoint, song);
  }

  /**
   * Update an existing song
   */
  updateSong(id: number, song: Omit<Song, 'id'>): Observable<Song> {
    return this.http.put<Song>(`${this.endpoint}/${id}`, song);
  }

  /**
   * Delete a song
   */
  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  private extractSongArray(payload: unknown): Song[] {
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        return this.extractSongArray(parsed);
      } catch {
        return [];
      }
    }

    if (Array.isArray(payload)) {
      return payload as Song[];
    }

    if (payload && typeof payload === 'object') {
      const wrapped = payload as {
        $values?: unknown;
        items?: unknown;
        data?: unknown;
        value?: unknown;
        result?: unknown;
        results?: unknown;
      };

      if (Array.isArray(wrapped.$values)) {
        return wrapped.$values as Song[];
      }

      if (Array.isArray(wrapped.items)) {
        return wrapped.items as Song[];
      }

      if (wrapped.data !== undefined) {
        return this.extractSongArray(wrapped.data);
      }

      if (wrapped.value !== undefined) {
        return this.extractSongArray(wrapped.value);
      }

      if (wrapped.result !== undefined) {
        return this.extractSongArray(wrapped.result);
      }

      if (wrapped.results !== undefined) {
        return this.extractSongArray(wrapped.results);
      }

      const discovered = this.findFirstArrayInObject(payload as Record<string, unknown>);
      if (discovered.length > 0) {
        return discovered;
      }
    }

    return [];
  }

  private findFirstArrayInObject(obj: Record<string, unknown>, depth = 0): Song[] {
    if (depth > 5) {
      return [];
    }

    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        return value as Song[];
      }

      if (value && typeof value === 'object') {
        const nested = this.findFirstArrayInObject(value as Record<string, unknown>, depth + 1);
        if (nested.length > 0) {
          return nested;
        }
      }
    }

    return [];
  }
}
