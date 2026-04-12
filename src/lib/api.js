import { Chord, chordTypes, getChordsFromSelectedNotes, intervals, notes } from "@benjamindehli/music-utils";
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

export function getAbsoluteNoteNumber(relativeNoteNumber, rootNoteNumber) {
    return rootNoteNumber + relativeNoteNumber;
}

export function getChordMatches(noteNumbers) {
    return getChordsFromSelectedNotes(noteNumbers);
}

export async function getImageDimensions(imagePath) {
    try {
        const { width, height } = await sharp(`public${imagePath}`).metadata();
        return { width, height };
    } catch (error) {
        console.error("Error reading image metadata:", error);
    }
}
