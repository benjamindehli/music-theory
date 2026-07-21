import { Chord, chordTypes, getChordsFromSelectedNotes, getChordsInScale, getScalesFromSelectedNotes, getSpelledNotes, intervals, notes, parseNoteName, Scale, scaleTypes } from "@benjamindehli/music-utils";
import { readFile } from "node:fs/promises";

// Pitch class (0–11) of each natural letter, indexed the same way as
// parseNoteName's letterIndex (C, D, E, F, G, A, B).
const LETTER_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11];

// Pitch class (0–11) of a spelled note name such as "Eb", "F#", or "Bbb".
function getNoteNumberFromName(name) {
    const parsed = parseNoteName(name);
    if (!parsed) return null;
    return (((LETTER_PITCH_CLASSES[parsed.letterIndex] + parsed.alt) % 12) + 12) % 12;
}

// Note names are now context-aware (e.g. "Eb", "Db", "Bbb"), and slugs/URLs mirror
// that spelling. Accidentals are encoded as words to match the site's "Csharp" style:
// "Eb" → "Eflat", "F#" → "Fsharp", "Bbb" → "Bflatflat". Only the lowercase "b"
// accidental is rewritten, so the uppercase note letter "B" is left untouched.
function noteNameToSlug(name) {
    return name.replaceAll("#", "sharp").replaceAll("b", "flat");
}

function noteSlugToName(slug) {
    return slug.replaceAll("sharp", "#").replaceAll("flat", "b");
}

export function getChordBySlug(slug, bassNoteSlug) {
    if (!slug) return null;
    const rootNumber = getNoteNumberFromName(noteSlugToName(slug.split("-")[0]));
    // Match on the forward-encoded name rather than reversing the slug, so type names
    // that contain hyphens (e.g. "Ode-to-Napoleon hexachord") resolve unambiguously.
    const chordTypeSlug = slug.split("-").slice(1).join("-");
    const chordType = chordTypes.find((chordType) => translateToSlug(chordType.name) === chordTypeSlug);
    const rootNote = notes.find((note) => note.number === rootNumber);
    // Passing the bass note lets the Chord constructor spell it in the chord's
    // context, e.g. C major over pitch class 10 reads "C/Bb", not "C/A#".
    const bassNumber = bassNoteSlug ? getNoteNumberFromName(noteSlugToName(bassNoteSlug)) : null;
    const bassNote = bassNumber === null ? undefined : notes.find((note) => note.number === bassNumber);
    const chord = new Chord({ rootNote, chordType, bassNote });
    return chord;
}

export function getNoteBySlug(slug) {
    if (!slug) return null;
    const number = getNoteNumberFromName(noteSlugToName(slug));
    return number === null ? null : notes.find((note) => note.number === number);
}

export function getIntervalsForChordType(chordType) {
    const intervalsForChordType = chordType.halfSteps.map((halfStep) => {
        return intervals.find((i) => i.number === halfStep);
    });
    return intervalsForChordType;
}

export function translateToSlug(string) {
    return string.replace("#", "sharp").replace("♭", "flat").replaceAll(/\s+/g, "-");
}

export function translateFromSlug(string) {
    return string.replace("sharp", "#").replace("flat", "♭").replaceAll("-", " ");
}

export function getAllChordSlugs() {
    return notes.flatMap((note) => {
        return chordTypes.map((chordType) => getSlugForChord(note, chordType));
    });
}

export function getAllNotes() {
    return notes;
}

export function getAllChordTypes() {
    return chordTypes;
}

// The correctly-spelled root name for a chord/scale of this type built on `note`,
// matching what the detail page shows (e.g. pitch class 3 reads "Eb" for a major
// chord, not the raw "D#"). The "chord"/"scale" kind must match the Chord/Scale
// class so the slug agrees with the rendered rootNote — the two spell some roots
// differently (e.g. the altered scale on pitch class 1 is "C#", but as a chord "Db").
export function getChordRootDisplayName(note, chordType) {
    const [root] = getSpelledNotes(note.number, chordType.halfSteps, undefined, "chord");
    return root ? root.name : note.name;
}

export function getScaleRootDisplayName(note, scaleType) {
    const [root] = getSpelledNotes(note.number, scaleType.halfSteps, undefined, "scale");
    return root ? root.name : note.name;
}

// Slugs use the same context-aware spelling as the page title, so a chord on
// pitch class 3 lives at "/chords/Eflat-major" (title "Eb major"), not "Dsharp-major".
export function getSlugForChord(note, chordType) {
    const rootName = getChordRootDisplayName(note, chordType);
    return [noteNameToSlug(rootName), translateToSlug(chordType.name)].filter(Boolean).join("-");
}

// Slugs a note by its own (already-spelled) name. For a slash-chord bass, pass the
// note spelled in the chord's context (see getSpelledBassNote).
export function getSlugForNote(note) {
    return noteNameToSlug(note.name);
}

// The slash-chord bass note spelled in the chord's context (e.g. "Bb", not "A#"),
// so its slug and label agree with the chord.
export function getSpelledBassNote(rootNote, chordType, bassNote) {
    const chord = new Chord({ rootNote, chordType, bassNote });
    return chord?.bassNote;
}

// Maps each pitch class in a chord/scale to its context-aware spelling, so the
// piano-diagram generator can label the highlighted keys correctly (e.g. "Bb", "Gb").
export function getSpelledNoteNamesForChord(rootNote, chordType, bassNote) {
    const chord = new Chord({ rootNote, chordType, bassNote });
    const map = {};
    chord.getNotes().forEach((note) => (map[note.number] = note.name));
    if (chord.bassNote) map[chord.bassNote.number] = chord.bassNote.name;
    return map;
}

export function getSpelledNoteNamesForScale(rootNote, scaleType) {
    const scale = new Scale({ rootNote, scaleType });
    const map = {};
    scale.getNotes().forEach((note) => (map[note.number] = note.name));
    return map;
}

export function getImagePngUrlForChordSlug(chordSlug, bassNoteSlug) {
    const bassNotePart = bassNoteSlug ? `_${bassNoteSlug}` : "";
    return `/images/chords/png/${chordSlug}${bassNotePart}.png`;
}

export function getImageSvgUrlForChordSlug(chordSlug, bassNoteSlug) {
    const bassNotePart = bassNoteSlug ? `_${bassNoteSlug}` : "";
    return `/images/chords/svg/${chordSlug}${bassNotePart}.svg`;
}

export function getImagePngUrlForScaleSlug(scaleSlug) {
    return `/images/scales/png/${scaleSlug}.png`;
}

export function getImageSvgUrlForScaleSlug(scaleSlug) {
    return `/images/scales/svg/${scaleSlug}.svg`;
}

export function getAbsoluteNoteNumber(relativeNoteNumber, rootNoteNumber) {
    return rootNoteNumber + relativeNoteNumber;
}

export function getIntervalsWithRelativeNotes(chord) {
    const intervalsForChordType = getIntervalsForChordType(chord.chordType);
    // Spell each note with correct enharmonics for this chord (e.g. F minor → Ab,
    // not G#), matching each interval to its spelled note by pitch class.
    const spelledByPitchClass = new Map(chord.getNotes().map((note) => [note.number, note]));
    return intervalsForChordType.map((interval) => {
        const pitchClass = getAbsoluteNoteNumber(interval.number, chord.rootNote.number) % 12;
        const relativeNote = spelledByPitchClass.get(pitchClass) ?? notes.find((note) => note.number === pitchClass);
        return { ...interval, relativeNote };
    });
}

export function getChordMatches(noteNumbers) {
    return getChordsFromSelectedNotes(noteNumbers);
}

export function getScaleBySlug(slug) {
    if (!slug) return null;
    const rootNumber = getNoteNumberFromName(noteSlugToName(slug.split("-")[0]));
    const scaleTypeSlug = slug.split("-").slice(1).join("-");
    const scaleType = scaleTypes.find((s) => translateToSlug(s.name) === scaleTypeSlug);
    const rootNote = notes.find((n) => n.number === rootNumber);
    if (!scaleType || rootNote === undefined) return null;
    return new Scale({ rootNote, scaleType });
}

export function getAllScaleTypes() {
    return scaleTypes;
}

export function getSlugForScale(note, scaleType) {
    const rootName = getScaleRootDisplayName(note, scaleType);
    return [noteNameToSlug(rootName), translateToSlug(scaleType.name)].filter(Boolean).join("-");
}

export function getIntervalsForScaleType(scaleType) {
    return scaleType.halfSteps.map((halfStep) => intervals.find((i) => i.number === halfStep));
}

export function getIntervalsWithRelativeNotesForScale(scale) {
    const intervalsForScaleType = getIntervalsForScaleType(scale.scaleType);
    // Spell each note with correct enharmonics for this scale (e.g. F major → Bb,
    // not A#), matching each interval to its spelled note by pitch class.
    const spelledByPitchClass = new Map(scale.getNotes().map((note) => [note.number, note]));
    return intervalsForScaleType.map((interval) => {
        const pitchClass = getAbsoluteNoteNumber(interval.number, scale.rootNote.number) % 12;
        const relativeNote = spelledByPitchClass.get(pitchClass) ?? notes.find((note) => note.number === pitchClass);
        return { ...interval, relativeNote };
    });
}

export function getScaleMatches(noteNumbers) {
    return getScalesFromSelectedNotes(noteNumbers);
}

export function getChordsForScale(scale) {
    return getChordsInScale(scale);
}

// Reads the pixel dimensions of a generated diagram without pulling the native
// `sharp` module into the build (its libvips binary fails to load on some CI
// runners). The images are produced by scripts/generate-pianos.js, so both formats
// have a well-defined header: PNG stores width/height as big-endian uint32s in the
// IHDR chunk, and the SVG carries them as attributes on its root element.
export async function getImageDimensions(imagePath) {
    try {
        const filePath = `public${imagePath}`;
        if (imagePath.endsWith(".svg")) {
            const svg = await readFile(filePath, "utf8");
            const openingTag = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
            const width = Number(openingTag.match(/\bwidth="([\d.]+)"/)?.[1]);
            const height = Number(openingTag.match(/\bheight="([\d.]+)"/)?.[1]);
            if (Number.isFinite(width) && Number.isFinite(height)) return { width, height };
            return undefined;
        }
        const buffer = await readFile(filePath);
        return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    } catch (error) {
        console.error("Error reading image metadata:", error);
    }
}

export async function getImagesWithDimensions(chordSlug, bassNoteSlug) {
    const imagePaths = { png: getImagePngUrlForChordSlug(chordSlug, bassNoteSlug), svg: getImageSvgUrlForChordSlug(chordSlug, bassNoteSlug) };
    const imagesWithSizes = {};
    for (const [format, path] of Object.entries(imagePaths)) {
        const dimensions = await getImageDimensions(path);
        imagesWithSizes[format] = { url: `/${process.env.PAGES_BASE_PATH}${path}`, ...dimensions };
    }
    return imagesWithSizes;
}

export async function getImagesWithDimensionsForScale(scaleSlug) {
    const imagePaths = { png: getImagePngUrlForScaleSlug(scaleSlug), svg: getImageSvgUrlForScaleSlug(scaleSlug) };
    const imagesWithSizes = {};
    for (const [format, path] of Object.entries(imagePaths)) {
        const dimensions = await getImageDimensions(path);
        imagesWithSizes[format] = { url: `/${process.env.PAGES_BASE_PATH}${path}`, ...dimensions };
    }
    return imagesWithSizes;
}
