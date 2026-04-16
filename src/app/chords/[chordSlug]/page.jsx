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
    getSlugForChord
} from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";

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
    if (!chord) return {};

    const chordName = `${chord.rootNote.name} ${chord.chordType.name}`;
    const intervals = getIntervalsWithRelativeNotes(chord);
    const noteNames = intervals.map((i) => i.relativeNote.name);
    const noteList =
        noteNames.length <= 2
            ? noteNames.join(" and ")
            : noteNames.slice(0, -1).join(", ") + " and " + noteNames[noteNames.length - 1];

    const title = `${chordName} chord`;
    const description = `Learn how to play the ${chordName} chord on piano. The ${chordName} chord consists of ${noteList}. Includes a piano keyboard diagram, intervals, and related chords.`;
    const canonicalUrl = `${SITE_ORIGIN}/chords/${chordSlug}/`;
    const imagePath = getImagePngUrlForChordSlug(chordSlug);
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
            images: [{ url: imageUrl, alt: `${chordName} chord piano keyboard diagram`, ...imageDimensions }]
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
            {chord && intervalsForChordType && (
                <>
                    <ChordFaqJsonLd chord={chord} intervalsForChordType={intervalsForChordType} />
                    <ChordHowToJsonLd chord={chord} intervalsForChordType={intervalsForChordType} />
                </>
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
