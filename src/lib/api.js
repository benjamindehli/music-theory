import { Chord, chordTypes, notes } from "@benjamindehli/music-utils";

// rootNote D# == slug D-sharp

export function getChordBySlug(slug) {
    if (!slug) return null;
    const rootNoteName = translateFromSlug(slug.split("-")[0]);
    const chordName = translateFromSlug(slug.split("-").slice(1).join("-"));
    const chordType = chordTypes.find((chordType) => chordType.name === chordName);
    const rootNote = notes.find((note) => note.name === rootNoteName);
    const chord = new Chord({ rootNote, chordType });
    console.log({ chord, slug, rootNote, chordName, chordType });
    return chord;
}

function translateToSlug(string) {
    return string.replace("#", "sharp").replace("b", "flat");
}

function translateFromSlug(string) {
    return string.replace("sharp", "#").replace("flat", "b");
}

export function getAllChordSlugs() {
    return notes.flatMap((note) => {
        return chordTypes.map((chordType) => {
            const chordSlug = [note.name, chordType.name].filter(Boolean).map(translateToSlug).join("-");
            return chordSlug;
        });
    });
}

export function getAllChords() {
    return chordTypes;
}

export function getAllNotes() {
    return notes;
}
