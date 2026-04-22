import { Chord, chordTypes, getChordsFromSelectedNotes, getChordsInScale, getScalesFromSelectedNotes, intervals, notes, Scale, scaleTypes } from "@benjamindehli/music-utils";
import sharp from "sharp";

export function getChordBySlug(slug) {
    if (!slug) return null;
    const rootNoteName = translateFromSlug(slug.split("-")[0]);
    const chordName = translateFromSlug(slug.split("-").slice(1).join("-"));
    const chordType = chordTypes.find((chordType) => chordType.name === chordName);
    const rootNote = notes.find((note) => note.name === rootNoteName);
    const chord = new Chord({ rootNote, chordType });
    return chord;
}

export function getNoteBySlug(slug) {
    if (!slug) return null;
    const noteName = translateFromSlug(slug);
    const note = notes.find((note) => note.name === noteName);
    return note;
}

export function getIntervalsForChordType(chordType) {
    const intervalsForChordType = chordType.halfSteps.map((halfStep) => {
        return intervals.find((i) => i.number === halfStep);
    });
    return intervalsForChordType;
}

export function translateToSlug(string) {
    return string.replace("#", "sharp").replace("b", "flat").replaceAll(/\s+/g, "-");
}

export function translateFromSlug(string) {
    return string.replace("sharp", "#").replace("flat", "b").replaceAll("-", " ");
}

export function getAllChordSlugs() {
    return notes.flatMap((note) => {
        return chordTypes.map((chordType) => {
            const chordSlug = [note.name, chordType.name].filter(Boolean).map(translateToSlug).join("-");
            return chordSlug;
        });
    });
}

export function getAllNotes() {
    return notes;
}

export function getAllChordTypes() {
    return chordTypes;
}

export function getSlugForChord(note, chordType) {
    const chordSlug = [note.name, chordType.name].filter(Boolean).map(translateToSlug).join("-");
    return chordSlug;
}

export function getSlugForNote(note) {
    return translateToSlug(note.name);
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
    return intervalsForChordType.map((interval) => {
        const relativeNoteNumber = getAbsoluteNoteNumber(interval.number, chord.rootNote.number);
        const relativeNote = notes.find((note) => note.number === relativeNoteNumber % 12);
        return { ...interval, relativeNote };
    });
}

export function getChordMatches(noteNumbers) {
    return getChordsFromSelectedNotes(noteNumbers);
}

export function getScaleBySlug(slug) {
    if (!slug) return null;
    const rootNoteName = translateFromSlug(slug.split("-")[0]);
    const scaleName = translateFromSlug(slug.split("-").slice(1).join("-"));
    const scaleType = scaleTypes.find((s) => s.name === scaleName);
    const rootNote = notes.find((n) => n.name === rootNoteName);
    if (!scaleType || !rootNote) return null;
    return new Scale({ rootNote, scaleType });
}

export function getAllScaleTypes() {
    return scaleTypes;
}

export function getSlugForScale(note, scaleType) {
    return [note.name, scaleType.name].filter(Boolean).map(translateToSlug).join("-");
}

export function getIntervalsForScaleType(scaleType) {
    return scaleType.halfSteps.map((halfStep) => intervals.find((i) => i.number === halfStep));
}

export function getIntervalsWithRelativeNotesForScale(scale) {
    const intervalsForScaleType = getIntervalsForScaleType(scale.scaleType);
    return intervalsForScaleType.map((interval) => {
        const relativeNoteNumber = getAbsoluteNoteNumber(interval.number, scale.rootNote.number);
        const relativeNote = notes.find((note) => note.number === relativeNoteNumber % 12);
        return { ...interval, relativeNote };
    });
}

export function getScaleMatches(noteNumbers) {
    return getScalesFromSelectedNotes(noteNumbers);
}

export function getChordsForScale(scale) {
    return getChordsInScale(scale);
}

export async function getImageDimensions(imagePath) {
    try {
        const { width, height } = await sharp(`public${imagePath}`).metadata();
        return { width, height };
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
