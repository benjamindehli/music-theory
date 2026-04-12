import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { generatePianoSVG } from "../src/lib/piano.js";
import { chordTypes, notes, intervals } from "@benjamindehli/music-utils";
import { getSlugForChord } from "../src/lib/api.js";

const OUTPUT_IMAGES_DIR = path.join(process.cwd(), "public/images");
const OUTPUT_CHORDS_DIR = path.join(process.cwd(), "public/images/chords");

// Ensure folder exists
fs.mkdirSync(OUTPUT_IMAGES_DIR, { recursive: true });
fs.mkdirSync(path.join(OUTPUT_CHORDS_DIR, "svg"), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_CHORDS_DIR, "png"), { recursive: true });

async function generateSvgForChord(rootNote, chordType, bassNote) {
    const notesInChord = chordType.halfSteps.map((halfStep) => rootNote.number + halfStep);
    let filenameBase = getSlugForChord(rootNote, chordType);
    if (bassNote) {
        filenameBase += `_${bassNote.name}`;
    }
    const svgPath = path.join(OUTPUT_CHORDS_DIR, "svg", `${filenameBase}.svg`);
    const pngPath = path.join(OUTPUT_CHORDS_DIR, "png", `${filenameBase}.png`);

    // Pass rootNote as MIDI number
    const svg = generatePianoSVG(notesInChord, { rootNote: rootNote.number, bassNote: bassNote?.number, chordType, intervals });

    // Save SVG
    fs.writeFileSync(svgPath, svg);

    // Save PNG
    const sharpOptions = {
        //density: 100 // higher density for better quality 100
    };
    const exifData = {
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
    const xmpString = `<?xml version="1.0"?>
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

    // Use withMetadata to embed both EXIF and XMP
    const pngBuffer = await sharp(Buffer.from(svg), sharpOptions)
        .png()
        .withMetadata({ exif: exifData, xmp: xmpString })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .toBuffer();

    fs.writeFileSync(pngPath, pngBuffer);
}

async function generate() {
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
