export const revalidate = 1;
import { getAllChordTypes, getAllNotes, getImagePngUrlForChordSlug, getImageSvgUrlForChordSlug, getSlugForChord } from "@/lib/api";

function generateImageElementsForChordImageUrl(chordImage, chordImageUrl) {
    return `
        <image:image>
            <image:loc>${chordImageUrl}</image:loc>
            <image:title>${chordImage.title}</image:title>
            <image:caption>${chordImage.caption}</image:caption>
            <image:license>https://creativecommons.org/licenses/by-sa/4.0/</image:license>
            <image:geo_location>Bø i Telemark, Norway</image:geo_location>
        </image:image>
    `;
}

function generateUrlElementForChordImages(chordImages) {
    const imageElements = chordImages.imageLocs.map((url) => generateImageElementsForChordImageUrl(chordImages, url)).join("");
    return `
        <url>
            <loc>${chordImages.pageLoc}</loc>
            ${imageElements}
        </url>
    `;
}

export async function GET() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chordImageLocs = notes.flatMap((note) => {
        return chordTypes.flatMap((chordType) => {
            const chordSlug = getSlugForChord(note, chordType);
            const title = `${note.name}${chordType.name} chord`;
            const caption = `Piano keys with the notes for a ${title} highlighted.`;
            const pageLoc = `https://benjamindehli.github.io/music-theory/chords/${chordSlug}`;
            const imageLocs = [getImagePngUrlForChordSlug(chordSlug), getImageSvgUrlForChordSlug(chordSlug)];
            return { pageLoc, imageLocs, title, caption };
        });
    });
    const urlElements = chordImageLocs.map((chordImages) => generateUrlElementForChordImages(chordImages)).join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${urlElements}
    </urlset>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" }
    });
}
