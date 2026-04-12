import ChordInfo from "@/components/ChordInfo";
import {
    getAllChordTypes,
    getAllNotes,
    getChordBySlug,
    getChordMatches,
    getImageDimensions,
    getImagePngUrlForChordSlug,
    getImageSvgUrlForChordSlug,
    getNoteBySlug,
    getIntervalsForChordType,
    getSlugForChord,
    getSlugForNote
} from "@/lib/api";

export const dynamicParams = false;

export function getAbsoluteNoteNumber(relativeNoteNumber, rootNoteNumber) {
    return rootNoteNumber + relativeNoteNumber;
}

function getIntervalsWithRelativeNotes(chord) {
    const intervalsForChordType = getIntervalsForChordType(chord.chordType);
    const intervalsWithRelativeNotes = intervalsForChordType.map((interval) => {
        const relativeNoteNumber = getAbsoluteNoteNumber(interval.number, chord.rootNote.number);
        const relativeNote = getAllNotes().find((note) => note.number === relativeNoteNumber % 12);
        return {
            ...interval,
            relativeNote
        };
    });
    return intervalsWithRelativeNotes;
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

export async function generateStaticParams() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const params = notes
        .flatMap((note) => {
            return chordTypes.flatMap((chordType) => {
                const chordSlug = getSlugForChord(note, chordType);
                return notes.map((bassNote) => {
                    const bassNoteSlug = getSlugForNote(bassNote);
                    if (bassNote.name === note.name) {
                        // Skip if bass note is the same as the root note
                        return null;
                    }
                    return { chordSlug, bassNoteSlug };
                });
            });
        })
        .flat()
        .filter(Boolean); // Remove null values
    return params;
}

export async function generateMetadata({ params }) {
    const { chordSlug, bassNoteSlug } = await params;
    const chord = getChordBySlug(chordSlug);
    const bassNote = getNoteBySlug(bassNoteSlug);
    return {
        title: chord ? `${chord.rootNote.name}${chord.chordType.name}/${bassNote.name} chord` : "",
        description: chord
            ? `Information about the ${chord.rootNote.name}${chord.chordType.name}/${bassNote.name} chord, including its intervals and related chords.`
            : ""
    };
}

export default async function Page({ params }) {
    const { chordSlug, bassNoteSlug } = await params;
    const chord = getChordBySlug(chordSlug);
    const bassNote = getNoteBySlug(bassNoteSlug);
    const intervalsForChordType = chord ? getIntervalsWithRelativeNotes(chord) : null;
    const noteNumbers = chord?.chordType?.halfSteps.map((halfStep) => {
        return getAbsoluteNoteNumber(halfStep, chord.rootNote.number) + 12; // Add 12 to shift to the next octave, since the bass note is different from the root note
    });
    noteNumbers?.push(bassNote?.number); // Add the bass note to the list of note numbers
    const chordMatches = getChordMatches(noteNumbers).filter(
        (match) =>
            match.chord.rootNote.name !== chord.rootNote.name ||
            match.chord.chordType.name !== chord.chordType.name ||
            match.chord.bassNote?.name !== bassNote.name
    );

    const imagesWithDimensions = await getImagesWithDimensions(chordSlug, bassNoteSlug);
    return (
        <ChordInfo
            chord={chord}
            intervalsForChordType={intervalsForChordType}
            chordMatches={chordMatches}
            imagesWithDimensions={imagesWithDimensions}
        />
    );
}
