export interface SongItem {
  slug: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  originalKey: string;
  lyricsWithChords: string[];
}

export const SONGS: SongItem[] = [
  {
    slug: 'lilim',
    title: 'Lilim',
    artist: 'Victory Worship',
    album: 'Radical Love',
    year: 2016,
    originalKey: 'E',
    lyricsWithChords: [
      '[Verse 1]',
      '[E]Panginoon, ang [G#m]nais [A]ko',
      '[C#m]Kagandahan mo ay [B]pagmasdan [E]',
      "[G#m]Ang pag-ibig mo, saki'y [A]tugon",
      "[C#m]Kailanma'y 'di [B]pababayaan [F#m]",
      '',
      '[Refrain]',
      '[G#m]Sa iyo lamang [A]matatagpuan [F#m]',
      '[G#m]Sa iyo [A]lamang [B]',
      '',
      '[Chorus]',
      '[E]Mananatili sa iyong [G#m]lilim',
      '[A]At sasambahin ka sa dakong [C#m]lihim [B]',
      '[E]Mananatili sa iyong [G#m]lilim',
      '[A]Nang masumpungan ka sa dakong [C#m]lihim [B]',
      '',
      '[Outro]',
      '[E]Mananatili sa iyong [G#m]lilim',
    ],
  },
  {
    slug: 'safe',
    title: 'Safe',
    artist: 'Victory Worship',
    album: 'Grace Changes Everything',
    year: 2018,
    originalKey: 'G',
    lyricsWithChords: [
      '[G|center]Licensed lyrics placeholder line 1 [D|right] [Em|left]',
      '[C]Licensed lyrics placeholder line 2',
      '[G]Licensed lyrics placeholder line 3',
      '[D]Licensed lyrics placeholder line 4',
    ],
  },
  {
    slug: 'radical-love',
    title: 'Radical Love',
    artist: 'Victory Worship',
    album: 'Radical Love',
    year: 2016,
    originalKey: 'D',
    lyricsWithChords: [
      '[D]Licensed lyrics placeholder line 1',
      '[A]Licensed lyrics placeholder line 2',
      '[Bm]Licensed lyrics placeholder line 3',
      '[G]Licensed lyrics placeholder line 4',
    ],
  },
  {
    slug: 'tribes',
    title: 'Tribes',
    artist: 'Victory Worship',
    album: 'Tribes',
    year: 2022,
    originalKey: 'E',
    lyricsWithChords: [
      '[E]Licensed lyrics placeholder line 1',
      '[B]Licensed lyrics placeholder line 2',
      '[C#m]Licensed lyrics placeholder line 3',
      '[A]Licensed lyrics placeholder line 4',
    ],
  },
];