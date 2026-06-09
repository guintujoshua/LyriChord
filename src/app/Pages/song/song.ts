import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeadToolBarNav } from '../../SharedPages/head-tool-bar-nav/head-tool-bar-nav';
import { GeneralFooter } from '../../SharedPages/general-footer/general-footer';
import { SongService, Song as SongData } from '../../services/song.service';
import { MatButtonModule } from '@angular/material/button';

interface LyricToken {
  text: string;
  chord?: string;
  placement?: ChordPlacement;
  chordOnly?: boolean;
}

interface ParsedLyricLine {
  tokens: LyricToken[];
  empty: boolean;
  sectionLabel?: string;
  sectionId?: string;
}

type ChordPlacement = 'above-center' | 'above-left' | 'above-right' | 'inline-before';

interface ParsedChordMarker {
  chord: string;
  placement?: ChordPlacement;
}

interface LyricSectionNav {
  id: string;
  label: string;
}

@Component({
  selector: 'app-song',
  imports: [HeadToolBarNav, GeneralFooter, RouterLink, MatButtonModule],
  templateUrl: './song.html',
  styleUrl: './song.scss',
})
export class Song implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly songService = inject(SongService);
  private readonly noteScale = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  private readonly flatToSharpMap: Record<string, string> = {
    Bb: 'A#',
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
  };

  readonly keys = this.noteScale;
  readonly selectedKey = signal<string>('C');
  readonly song = signal<SongData | null>(null);

  readonly currentKey = computed(() => this.selectedKey());

  readonly semitoneShift = computed(() => {
    const selectedSong = this.song();
    if (!selectedSong) {
      return 0;
    }

    const fromIndex = this.getNoteIndex(selectedSong.key);
    const toIndex = this.getNoteIndex(this.currentKey());

    if (fromIndex === -1 || toIndex === -1) {
      return 0;
    }

    return (toIndex - fromIndex + this.noteScale.length) % this.noteScale.length;
  });

  readonly parsedLyrics = computed<ParsedLyricLine[]>(() => {
    const selectedSong = this.song();

    if (!selectedSong) {
      return [];
    }

    const normalizedLines = this.normalizeLyricsLines(selectedSong.lyricsWithChords);
    return normalizedLines.map((line, index) => this.parseLine(line, index, this.semitoneShift()));
  });

  readonly lyricSections = computed<LyricSectionNav[]>(() => {
    return this.parsedLyrics()
      .filter((line) => Boolean(line.sectionLabel && line.sectionId))
      .map((line) => ({
        id: line.sectionId as string,
        label: line.sectionLabel as string,
      }));
  });

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadSong(slug);
    }
  }

  private loadSong(slug: string): void {
    const id = parseInt(slug, 10);
    if (!isNaN(id)) {
      this.songService.getSongById(id).subscribe({
        next: (data) => {
          this.song.set(data);
          this.selectedKey.set(this.normalizeNote(data.key));
        },
        error: (err) => {
          console.error('Failed to load song:', err);
          this.song.set(null);
        }
      });
    } else {
      this.songService.getAllSongs().subscribe({
        next: (songs) => {
          const found = songs.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === slug);
          if (found) {
            this.song.set(found);
            this.selectedKey.set(this.normalizeNote(found.key));
          } else {
            this.song.set(null);
          }
        },
        error: (err) => {
          console.error('Failed to load songs:', err);
          this.song.set(null);
        }
      });
    }
  }

  constructor() {
    effect(
      () => {
        const selectedSong = this.song();
        if (!selectedSong) {
          this.selectedKey.set('C');
          return;
        }

        this.selectedKey.set(this.normalizeNote(selectedSong.key));
      },
      { allowSignalWrites: true },
    );
  }

  setKey(nextKey: string): void {
    this.selectedKey.set(this.normalizeNote(nextKey));
  }

  shiftKey(step: number): void {
    const currentIndex = this.getNoteIndex(this.currentKey());
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + step + this.noteScale.length) % this.noteScale.length;
    this.selectedKey.set(this.noteScale[nextIndex]);
  }

  scrollToSection(sectionId: string): void {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private parseLine(line: string, lineIndex: number, semitoneShift: number): ParsedLyricLine {
    const trimmed = line.trim();

    if (!trimmed) {
      return { tokens: [], empty: true };
    }

    if (this.isSectionMarker(trimmed)) {
      const label = this.extractSectionLabel(trimmed);

      return {
        tokens: [],
        empty: false,
        sectionLabel: label,
        sectionId: this.buildSectionId(label, lineIndex),
      };
    }

    const tokens: LyricToken[] = [];
    let pendingChord: ParsedChordMarker | undefined;
    const parts = line.match(/(\[[^\]]+\])|(\S+\s*)|(\s+)/g) ?? [];

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];

      if (part.startsWith('[') && part.endsWith(']')) {
        const chordMarker = this.parseChordMarker(part);

        if (!this.isValidChordToken(chordMarker.chord)) {
          tokens.push({ text: part });
          pendingChord = undefined;
          continue;
        }

        const nextVisiblePart = this.findNextVisiblePart(parts, index + 1);

        if (!nextVisiblePart || this.isChordMarker(nextVisiblePart)) {
          tokens.push(this.createChordOnlyToken(chordMarker));
          pendingChord = undefined;
        } else {
          pendingChord = chordMarker;
        }

        continue;
      }

      const hasVisibleChars = /\S/.test(part);

      if (pendingChord && hasVisibleChars) {
        tokens.push({
          text: part,
          chord: this.transposeChord(pendingChord.chord, semitoneShift),
          placement: pendingChord.placement,
        });
        pendingChord = undefined;
      } else {
        tokens.push({ text: part });
      }
    }

    return { tokens, empty: false };
  }

  private isChordMarker(part: string): boolean {
    return part.startsWith('[') && part.endsWith(']');
  }

  private findNextVisiblePart(parts: string[], fromIndex: number): string | undefined {
    for (let index = fromIndex; index < parts.length; index += 1) {
      const part = parts[index];
      if (/\S/.test(part)) {
        return part;
      }
    }

    return undefined;
  }

  private createChordOnlyToken(chordMarker: ParsedChordMarker): LyricToken {
    const blankWidth = Math.max(chordMarker.chord.length + 1, 3);

    return {
      text: ' '.repeat(blankWidth),
      chord: this.transposeChord(chordMarker.chord, this.semitoneShift()),
      placement: chordMarker.placement,
      chordOnly: true,
    };
  }

  private transposeChord(chord: string, semitoneShift: number): string {
    const [baseChord, bassChord] = chord.split('/');
    const transposedBase = this.transposeChordPart(baseChord, semitoneShift);

    if (!bassChord) {
      return transposedBase;
    }

    const transposedBass = this.transposeChordPart(bassChord, semitoneShift);
    return `${transposedBase}/${transposedBass}`;
  }

  private transposeChordPart(chordPart: string, semitoneShift: number): string {
    const match = chordPart.match(/^([A-G](?:#|b)?)(.*)$/);
    if (!match) {
      return chordPart;
    }

    const [, rootRaw, suffix] = match;
    const root = this.normalizeNote(rootRaw);
    const rootIndex = this.getNoteIndex(root);

    if (rootIndex === -1) {
      return chordPart;
    }

    const nextIndex = (rootIndex + semitoneShift + this.noteScale.length) % this.noteScale.length;
    return `${this.noteScale[nextIndex]}${suffix}`;
  }

  private normalizeNote(note: string): string {
    const trimmed = note.trim();
    return this.flatToSharpMap[trimmed] ?? trimmed;
  }

  private getNoteIndex(note: string): number {
    return this.noteScale.indexOf(this.normalizeNote(note));
  }

  private parseChordMarker(marker: string): ParsedChordMarker {
    const raw = marker.slice(1, -1).trim();
    const [chordRaw, placementRaw] = raw.split('|').map((part) => part.trim());

    return {
      chord: chordRaw,
      placement: this.normalizePlacement(placementRaw),
    };
  }

  private isValidChordToken(value: string): boolean {
    // Accepts roots A-G with optional accidental and common chord modifiers/slashes.
    return /^([A-G](?:#|b)?)(?:[a-zA-Z0-9+()/#-]*)?(?:\/[A-G](?:#|b)?(?:[a-zA-Z0-9+()/#-]*)?)?$/.test(value);
  }

  private normalizePlacement(rawPlacement?: string): ChordPlacement | undefined {
    if (!rawPlacement) {
      return undefined;
    }

    const placement = rawPlacement.toLowerCase();

    if (placement === 'left' || placement === 'above-left') {
      return 'above-left';
    }

    if (placement === 'center' || placement === 'above-center' || placement === 'above') {
      return 'above-center';
    }

    if (placement === 'right' || placement === 'above-right') {
      return 'above-right';
    }

    if (placement === 'inline' || placement === 'before' || placement === 'inline-before') {
      return 'inline-before';
    }

    return undefined;
  }

  private isSectionMarker(trimmedLine: string): boolean {
    const label = this.normalizeSectionLabel(trimmedLine);
    if (!label) {
      return false;
    }

    // Accept common worship-song section names with optional numbers/suffixes.
    return /^(verse|chorus|refrain|tag|bridge|pre\s*-?\s*chorus|intro|outro|hook|interlude|instrumental)(\s*[0-9a-z]+)?$/i.test(label);
  }

  private extractSectionLabel(trimmedLine: string): string {
    return this.normalizeSectionLabel(trimmedLine);
  }

  private normalizeSectionLabel(rawLine: string): string {
    const trimmed = rawLine.trim().replace(/^['"]+|['"]+$/g, '').trim();
    const bracketedMatch = trimmed.match(/^\[(.+)\]$/);
    const candidate = (bracketedMatch ? bracketedMatch[1] : trimmed).trim();
    return candidate.replace(/[:\-]+$/g, '').trim();
  }

  private normalizeLyricsLines(lines: string[]): string[] {
    const normalized: string[] = [];

    for (const rawLine of lines) {
      const line = String(rawLine ?? '').trim();
      if (!line) {
        normalized.push('');
        continue;
      }

      // Repair malformed CSV-imported lines where section labels are embedded inline.
      const csvParts = line
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      const hasEmbeddedSection = csvParts.some((part) => this.isSectionMarker(part));
      if (!hasEmbeddedSection) {
        normalized.push(line);
        continue;
      }

      for (const part of csvParts) {
        if (part.length > 0) {
          normalized.push(part);
        }
      }
    }

    return normalized;
  }

  private buildSectionId(label: string, lineIndex: number): string {
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return `section-${slug || 'part'}-${lineIndex}`;
  }
}
