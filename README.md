# Music Theory

A static Next.js site for exploring chords and scales on piano.

## Features

- Piano keyboard diagrams (SVG and PNG) for all chords and scales
- Chord pages with intervals, related chords, and slash chord variants
- Scale pages with intervals, chords in the scale (grouped by root note), and related scales
- FAQ and HowTo JSON-LD structured data on both chord and scale pages
- XML image sitemaps for chords and scales

## Tech Stack

- Next.js 16 (static export)
- React 19 with React Compiler
- `@benjamindehli/music-utils` — music theory data and utilities
- Sharp for SVG-to-PNG conversion and image metadata

## Getting Started

```sh
yarn install
yarn build
yarn start
```

Visit the site at `http://localhost:3000/music-theory` (or your configured base path).

## Development

```sh
yarn dev    # local dev server
yarn lint   # ESLint
```

To regenerate all piano keyboard images (SVG + PNG) after changes to `src/lib/piano.js`:

```sh
node scripts/generate-pianos.js
```

Images are committed to the repo under `public/images/chords/` and `public/images/scales/`.
