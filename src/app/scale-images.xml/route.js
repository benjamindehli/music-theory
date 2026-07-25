import { getAllScaleTypes, getAllNotes, getImagePngUrlForScaleSlug, getImageSvgUrlForScaleSlug, getScaleNounSuffix, getSlugForScale } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";

export const dynamic = "force-static";

function generateImageElementsForScaleImageUrl(scaleImage, scaleImageUrl) {
    return `
        <image:image>
            <image:loc>${scaleImageUrl}</image:loc>
            <image:title>${scaleImage.title}</image:title>
            <image:caption>${scaleImage.caption}</image:caption>
            <image:license>https://creativecommons.org/licenses/by-sa/4.0/</image:license>
            <image:geo_location>Bø i Telemark, Norway</image:geo_location>
        </image:image>
    `;
}

function generateUrlElementForScaleImages(scaleImages) {
    const imageElements = scaleImages.imageLocs.map((url) => generateImageElementsForScaleImageUrl(scaleImages, url)).join("");
    return `
        <url>
            <loc>${scaleImages.pageLoc}</loc>
            ${imageElements}
        </url>
    `;
}

export async function GET() {
    const notes = getAllNotes();
    const scaleTypes = getAllScaleTypes();
    const scaleImageLocs = notes.flatMap((note) => {
        return scaleTypes.flatMap((scaleType) => {
            const scaleSlug = getSlugForScale(note, scaleType);
            const title = `${note.name} ${scaleType.name}${getScaleNounSuffix(scaleType)}`;
            const caption = `Piano keys with the notes for a ${title} highlighted.`;
            const pageLoc = `${SITE_ORIGIN}/scales/${scaleSlug}/`;
            const imageLocs = [`${SITE_ORIGIN}${getImagePngUrlForScaleSlug(scaleSlug)}`, `${SITE_ORIGIN}${getImageSvgUrlForScaleSlug(scaleSlug)}`];
            return { pageLoc, imageLocs, title, caption };
        });
    });
    const urlElements = scaleImageLocs.map((scaleImages) => generateUrlElementForScaleImages(scaleImages)).join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${urlElements}
    </urlset>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" }
    });
}
