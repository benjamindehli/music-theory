import ChordInfo from "@/components/ChordInfo";
import {
    getAllChordTypes,
    getAllNotes,
    getChordBySlug,
    getChordMatches,
    getImageDimensions,
    getImagePngUrlForChordSlug,
    getImageSvgUrlForChordSlug,
    getIntervalsForChordType,
    getSlugForChord
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

export async function getImagesWithDimensions(chordSlug) {
    const imagePaths = { png: getImagePngUrlForChordSlug(chordSlug), svg: getImageSvgUrlForChordSlug(chordSlug) };
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
        <ChordInfo
            chord={chord}
            intervalsForChordType={intervalsForChordType}
            chordMatches={chordMatches}
            imagesWithDimensions={imagesWithDimensions}
        />
    );
}
