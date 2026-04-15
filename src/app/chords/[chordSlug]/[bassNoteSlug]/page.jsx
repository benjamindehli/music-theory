import Breadcrumbs from "@/components/Breadcrumbs";
import ChordFaqJsonLd from "@/components/ChordFaqJsonLd";
import ChordInfo from "@/components/ChordInfo";
import {
    getAbsoluteNoteNumber,
    getAllChordTypes,
    getAllNotes,
    getChordBySlug,
    getChordMatches,
    getImagesWithDimensions,
    getIntervalsWithRelativeNotes,
    getNoteBySlug,
    getSlugForChord,
    getSlugForNote
} from "@/lib/api";

export const dynamicParams = false;

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
        <>
            <Breadcrumbs params={params} />
            {chord && intervalsForChordType && bassNote && (
                <ChordFaqJsonLd chord={chord} intervalsForChordType={intervalsForChordType} bassNote={bassNote} />
            )}
            <ChordInfo
                chord={chord}
                intervalsForChordType={intervalsForChordType}
                chordMatches={chordMatches}
                imagesWithDimensions={imagesWithDimensions}
            />
        </>
    );
}
