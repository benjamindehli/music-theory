import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { generatePianoSVG } from "../src/lib/piano.js";
import { notes, intervals } from "@benjamindehli/music-utils";
import { getAllChordTypes, getAllScaleTypes, getSlugForChord, getSlugForNote, getSlugForScale } from "../src/lib/api.js";

const OUTPUT_IMAGES_DIR = path.join(process.cwd(), "public/images");
const OUTPUT_CHORDS_DIR = path.join(process.cwd(), "public/images/chords");
const OUTPUT_SCALES_DIR = path.join(process.cwd(), "public/images/scales");

const SHARP_OPTIONS = {
    density: 100
};

const EXIF_DATA = {
    IFD0: {
        Copyright: "Benjamin Dehli"
    },
        IFD3: {
            GPSLatitudeRef: "N",
            GPSLatitude: "59 26 44.6886",
            GPSLongitudeRef: "E",
        GPSLongitude: "9 5 3.7104"
    }
};

const XMP_STRING = `<?xml version="1.0"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
            <dc:creator><rdf:Seq><rdf:li>Benjamin Dehli</rdf:li></rdf:Seq></dc:creator>
            <dc:rights>Copyright 2026 Benjamin Dehli</dc:rights>
            <xmpRights:Marked>True</xmpRights:Marked>
            <xmpRights:WebStatement>https://www.dehlimusikk.no</xmpRights:WebStatement>
            <cc:attributionName>Benjamin Dehli</cc:attributionName>
            <cc:attributionURL>https://www.dehlimusikk.no</cc:attributionURL>
            <cc:license>https://creativecommons.org/licenses/by/4.0/</cc:license>
        </rdf:Description>
    </rdf:RDF>
</x:xmpmeta>`;

// Ensure folder exists
fs.mkdirSync(OUTPUT_IMAGES_DIR, { recursive: true });
fs.mkdirSync(path.join(OUTPUT_CHORDS_DIR, "svg"), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_CHORDS_DIR, "png"), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_SCALES_DIR, "svg"), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_SCALES_DIR, "png"), { recursive: true });

function getNotesInChord(rootNote, chordType) {
    return chordType.halfSteps.map((halfStep) => rootNote.number + halfStep);
}

async function generateSvgForChord(rootNote, chordType, bassNote) {
    const notesInChord = getNotesInChord(rootNote, chordType);
    let filenameBase = getSlugForChord(rootNote, chordType);
    if (bassNote) {
        filenameBase += `_${getSlugForNote(bassNote)}`;
    }
    const svgPath = path.join(OUTPUT_CHORDS_DIR, "svg", `${filenameBase}.svg`);
    const pngPath = path.join(OUTPUT_CHORDS_DIR, "png", `${filenameBase}.png`);

    // Pass rootNote as MIDI number
    const svg = generatePianoSVG(notesInChord, { rootNote: rootNote.number, bassNote: bassNote?.number, chordType, intervals });

    // Save SVG
    fs.writeFileSync(svgPath, svg);

    // Use withMetadata to embed both EXIF and XMP
    const pngBuffer = await sharp(Buffer.from(svg), SHARP_OPTIONS)
        .png()
        .withMetadata({ exif: EXIF_DATA, xmp: XMP_STRING })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .toBuffer();

    fs.writeFileSync(pngPath, pngBuffer);
}

async function generateSvgForScale(rootNote, scaleType) {
    const notesInScale = scaleType.halfSteps.map((halfStep) => rootNote.number + halfStep);
    const filenameBase = getSlugForScale(rootNote, scaleType);
    const svgPath = path.join(OUTPUT_SCALES_DIR, "svg", `${filenameBase}.svg`);
    const pngPath = path.join(OUTPUT_SCALES_DIR, "png", `${filenameBase}.png`);

    // Pass rootNote as MIDI number
    const svg = generatePianoSVG(notesInScale, { rootNote: rootNote.number, scaleType, intervals });

    // Save SVG
    fs.writeFileSync(svgPath, svg);

    // Use withMetadata to embed both EXIF and XMP
    const pngBuffer = await sharp(Buffer.from(svg), SHARP_OPTIONS)
        .png()
        .withMetadata({ exif: EXIF_DATA, xmp: XMP_STRING })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .toBuffer();

    fs.writeFileSync(pngPath, pngBuffer);
}

async function generate() {
    const chordTypes = getAllChordTypes();
    for (const rootNote of notes) {
        for (const chordType of chordTypes) {
            await generateSvgForChord(rootNote, chordType);
            for (const bassNote of notes) {
                if (bassNote.number === rootNote.number) continue; // Skip if bass note is same as root
                await generateSvgForChord(rootNote, chordType, bassNote);
            }
        }
    }
}

await generate();
