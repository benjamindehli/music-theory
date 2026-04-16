import Breadcrumbs from "@/components/Breadcrumbs";
import ChordFaqJsonLd from "@/components/ChordFaqJsonLd";
import ChordHowToJsonLd from "@/components/ChordHowToJsonLd";
import ChordInfo from "@/components/ChordInfo";
import {
    getAbsoluteNoteNumber,
    getAllChordTypes,
    getAllNotes,
    getChordBySlug,
    getChordMatches,
    getImageDimensions,
    getImagePngUrlForChordSlug,
    getImagesWithDimensions,
    getIntervalsWithRelativeNotes,
    getNoteBySlug,
    getSlugForChord,
    getSlugForNote
} from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";

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
    if (!chord || !bassNote) return {};

    const chordName = `${chord.rootNote.name} ${chord.chordType.name}`;
    const fullChordName = `${chordName}/${bassNote.name}`;
    const intervals = getIntervalsWithRelativeNotes(chord);
    const noteNames = intervals.map((i) => i.relativeNote.name);
    const noteList =
        noteNames.length <= 2
            ? noteNames.join(" and ")
            : noteNames.slice(0, -1).join(", ") + " and " + noteNames[noteNames.length - 1];

    const title = `${fullChordName} chord`;
    const description = `Learn how to play the ${fullChordName} chord on piano. A ${chordName} chord (${noteList}) with ${bassNote.name} as the bass note. Includes a piano keyboard diagram and related chords.`;
    const canonicalUrl = `${SITE_ORIGIN}/chords/${chordSlug}/${bassNoteSlug}/`;
    const imagePath = getImagePngUrlForChordSlug(chordSlug, bassNoteSlug);
    const imageUrl = `${SITE_ORIGIN}${imagePath}`;
    const imageDimensions = await getImageDimensions(imagePath);

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: "website",
            url: canonicalUrl,
            siteName: "Music theory",
            locale: "en_US",
            title,
            description,
            images: [{ url: imageUrl, alt: `${fullChordName} chord piano keyboard diagram`, ...imageDimensions }]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl]
        }
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
                <>
                    <ChordFaqJsonLd chord={chord} intervalsForChordType={intervalsForChordType} bassNote={bassNote} />
                    <ChordHowToJsonLd chord={chord} intervalsForChordType={intervalsForChordType} bassNote={bassNote} />
                </>
            )}
            <ChordInfo
                chord={chord}
                intervalsForChordType={intervalsForChordType}
                chordMatches={chordMatches}
                imagesWithDimensions={imagesWithDimensions}
                bassNote={bassNote}
            />
        </>
    );
}
