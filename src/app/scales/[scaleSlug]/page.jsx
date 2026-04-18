import Breadcrumbs from "@/components/Breadcrumbs";
import ScaleInfo from "@/components/ScaleInfo";
import {
    getAbsoluteNoteNumber,
    getAllNotes,
    getAllScaleTypes,
    getIntervalsWithRelativeNotesForScale,
    getScaleBySlug,
    getScaleMatches,
    getSlugForScale
} from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";

export const dynamicParams = false;

export async function generateStaticParams() {
    const notes = getAllNotes();
    const scaleTypes = getAllScaleTypes();
    return notes.flatMap((note) =>
        scaleTypes.map((scaleType) => ({
            scaleSlug: getSlugForScale(note, scaleType)
        }))
    );
}

export async function generateMetadata({ params }) {
    const { scaleSlug } = await params;
    const scale = getScaleBySlug(scaleSlug);
    if (!scale) return {};

    const scaleName = `${scale.rootNote.name} ${scale.scaleType.name}`;
    const intervals = getIntervalsWithRelativeNotesForScale(scale);
    const noteNames = intervals.map((i) => i.relativeNote.name);
    const noteList =
        noteNames.length <= 2
            ? noteNames.join(" and ")
            : noteNames.slice(0, -1).join(", ") + " and " + noteNames[noteNames.length - 1];

    const title = scaleName;
    const description = `Learn the ${scaleName}. The ${scaleName} consists of ${noteList}. Includes intervals and related scales.`;
    const canonicalUrl = `${SITE_ORIGIN}/scales/${scaleSlug}/`;

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
            description
        },
        twitter: {
            card: "summary",
            title,
            description
        }
    };
}

export default async function Page({ params }) {
    const { scaleSlug } = await params;
    const scale = getScaleBySlug(scaleSlug);
    const intervalsForScaleType = scale ? getIntervalsWithRelativeNotesForScale(scale) : null;
    const noteNumbers = scale?.scaleType?.halfSteps.map((halfStep) => getAbsoluteNoteNumber(halfStep, scale.rootNote.number));
    const scaleMatches = scale
        ? getScaleMatches(noteNumbers).filter(
              (match) => match.scale.rootNote.name !== scale.rootNote.name || match.scale.scaleType.name !== scale.scaleType.name
          )
        : [];

    return (
        <>
            <Breadcrumbs params={params} />
            <ScaleInfo scale={scale} intervalsForScaleType={intervalsForScaleType} scaleMatches={scaleMatches} />
        </>
    );
}
