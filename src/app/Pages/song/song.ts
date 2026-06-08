import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeadToolBarNav } from '../../SharedPages/head-tool-bar-nav/head-tool-bar-nav';
import { GeneralFooter } from '../../SharedPages/general-footer/general-footer';
import { SONGS } from '../../song-data';
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
export class Song {
  private readonly route = inject(ActivatedRoute);
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

  readonly song = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return SONGS.find((item) => item.slug === slug) ?? null;
  });

  readonly currentKey = computed(() => this.selectedKey());

  readonly semitoneShift = computed(() => {
    const selectedSong = this.song();
    if (!selectedSong) {
      return 0;
    }

    const fromIndex = this.getNoteIndex(selectedSong.originalKey);
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

    return selectedSong.lyricsWithChords.map((line, index) => this.parseLine(line, index, this.semitoneShift()));
  });

  readonly lyricSections = computed<LyricSectionNav[]>(() => {
    return this.parsedLyrics()
      .filter((line) => Boolean(line.sectionLabel && line.sectionId))
      .map((line) => ({
        id: line.sectionId as string,
        label: line.sectionLabel as string,
      }));
  });

  constructor() {
    effect(
      () => {
        const selectedSong = this.song();
        if (!selectedSong) {
          this.selectedKey.set('C');
          return;
        }

        this.selectedKey.set(this.normalizeNote(selectedSong.originalKey));
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
    const markerMatch = trimmedLine.match(/^\[(.+)\]$/);
    if (!markerMatch) {
      return false;
    }

    const label = markerMatch[1].trim();

    if (!label) {
      return false;
    }

    return /^(verse|chorus|refrain|tag|bridge)(\s*\d+)?$/i.test(label);
  }

  private extractSectionLabel(trimmedLine: string): string {
    return trimmedLine.slice(1, -1).trim();
  }

  private buildSectionId(label: string, lineIndex: number): string {
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return `section-${slug || 'part'}-${lineIndex}`;
  }
}
