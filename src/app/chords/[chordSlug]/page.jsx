import Breadcrumbs from "@/components/Breadcrumbs";
import ChordInfo from "@/components/ChordInfo";
import {
    getAbsoluteNoteNumber,
    getAllChordTypes,
    getAllNotes,
    getChordBySlug,
    getChordMatches,
    getImagesWithDimensions,
    getIntervalsWithRelativeNotes,
    getSlugForChord
} from "@/lib/api";

export const dynamicParams = false;

export async function generateStaticParams() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chordSlugs = notes.flatMap((note) => {
        return chordTypes.map((chordType) => {
            const chordSlug = getSlugForChord(note, chordType);
            return { chordSlug };
        });
    });
    return chordSlugs;
}

export async function generateMetadata({ params }) {
    const { chordSlug } = await params;
    const chord = getChordBySlug(chordSlug);
    return {
        title: chord ? `${chord.rootNote.name}${chord.chordType.name} chord` : "",
        description: chord
            ? `Information about the ${chord.rootNote.name}${chord.chordType.name} chord, including its intervals and related chords.`
            : ""
    };
}

export default async function Page({ params }) {
    const { chordSlug } = await params;
    const chord = getChordBySlug(chordSlug);
    const intervalsForChordType = chord ? getIntervalsWithRelativeNotes(chord) : null;
    const noteNumbers = chord?.chordType?.halfSteps.map((halfStep) => getAbsoluteNoteNumber(halfStep, chord.rootNote.number));
    const chordMatches = getChordMatches(noteNumbers).filter(
        (match) => match.chord.rootNote.name !== chord.rootNote.name || match.chord.chordType.name !== chord.chordType.name
    );

    const imagesWithDimensions = await getImagesWithDimensions(chordSlug);
    return (
        <>
            <Breadcrumbs params={params} />
            <ChordInfo
                chord={chord}
                intervalsForChordType={intervalsForChordType}
                chordMatches={chordMatches}
                imagesWithDimensions={imagesWithDimensions}
            />
        </>
    );
}
