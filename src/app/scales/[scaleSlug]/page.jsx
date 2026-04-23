import Breadcrumbs from "@/components/Breadcrumbs";
import ScaleFaqJsonLd from "@/components/ScaleFaqJsonLd";
import ScaleHowToJsonLd from "@/components/ScaleHowToJsonLd";
import ScaleInfo from "@/components/ScaleInfo";
import {
    getAbsoluteNoteNumber,
    getAllNotes,
    getAllScaleTypes,
    getChordsForScale,
    getImageDimensions,
    getImagePngUrlForScaleSlug,
    getImagesWithDimensionsForScale,
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

    const title = `${scaleName} scale`;
    const description = `Learn how to play the ${scaleName} scale on piano. The ${scaleName} scale consists of ${noteList}. Includes a piano keyboard diagram, intervals, and related scales.`;
    const canonicalUrl = `${SITE_ORIGIN}/scales/${scaleSlug}/`;
    const imagePath = getImagePngUrlForScaleSlug(scaleSlug);
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
            images: [{ url: imageUrl, alt: `${scaleName} piano keyboard diagram`, ...imageDimensions }]
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
    const { scaleSlug } = await params;
    const scale = getScaleBySlug(scaleSlug);
    const intervalsForScaleType = scale ? getIntervalsWithRelativeNotesForScale(scale) : null;
    const noteNumbers = scale?.scaleType?.halfSteps.map((halfStep) => getAbsoluteNoteNumber(halfStep, scale.rootNote.number));
    const scaleMatches = scale
        ? getScaleMatches(noteNumbers).filter(
              (match) => match.scale.rootNote.name !== scale.rootNote.name || match.scale.scaleType.name !== scale.scaleType.name
          )
        : [];

    const chordsInScale = scale ? getChordsForScale(scale) : [];
    const imagesWithDimensions = await getImagesWithDimensionsForScale(scaleSlug);

    return (
        <>
            <Breadcrumbs params={params} />
            {scale && intervalsForScaleType && (
                <>
                    <ScaleFaqJsonLd scale={scale} intervalsForScaleType={intervalsForScaleType} />
                    <ScaleHowToJsonLd scale={scale} intervalsForScaleType={intervalsForScaleType} />
                </>
            )}
            <ScaleInfo
                scale={scale}
                intervalsForScaleType={intervalsForScaleType}
                scaleMatches={scaleMatches}
                chordsInScale={chordsInScale}
                imagesWithDimensions={imagesWithDimensions}
            />
        </>
    );
}
