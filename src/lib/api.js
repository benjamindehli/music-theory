import { chords, notes } from "@benjamindehli/music-utils";

// rootNote D# == slug D-sharp

export function getChordBySlug(slug) {
    if (!slug) return null;
    const rootNote = translateFromSlug(slug.split("-")[0]);
    const chordName = translateFromSlug(slug.split("-").slice(1).join("-"));
    const chord = chords.find((chord) => chord.name === chordName);
    return { ...chord, rootNote: rootNote?.toUpperCase() };
}

function translateToSlug(string) {
    return string.replace("#", "sharp").replace("b", "flat");
}

function translateFromSlug(string) {
    return string.replace("sharp", "#").replace("flat", "b");
}

export function getAllChordSlugs() {
    return notes.flatMap((note) => {
        return chords.map((chord) => {
            const chordSlug = [note.name, chord.name].filter(Boolean).map(translateToSlug).join("-");
            return {
                params: {
                    chordSlug
                }
            };
        });
    });
}

export function getAllChords() {
    return chords;
}

export function getAllNotes() {
    return notes;
}
