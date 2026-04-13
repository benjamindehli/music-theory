# Music Theory

A static Next.js site for exploring chords and scales.

## Features

- Piano chord images (SVG and PNG) for all chord types and roots
- Chord pages and chord info
- Static export for fast, serverless hosting

## Tech Stack

- Next.js 16 (static export)
- React 19
- Custom music theory utilities (`@benjamindehli/music-utils`)
- Sharp for image processing

## Getting Started

```sh
yarn install
yarn build
yarn start
```

Visit the site at `http://localhost:3000/music-theory` (or your configured base path).

## Development

- Run `yarn dev` for local development.
- Use `scripts/generate-pianos.js` to regenerate chord images.

## Folder Structure

- `src/app/` — Next.js app directory (routes, pages, API)
- `src/components/` — React UI components
- `public/images/chords/` — Generated chord images (SVG, PNG)
- `scripts/` — Utilities for image generation
