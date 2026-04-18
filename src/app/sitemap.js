import { getAllChordTypes, getAllNotes, getAllScaleTypes, getSlugForChord, getSlugForNote, getSlugForScale } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";

function generateSlashChordUrls() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chordUrls = notes.flatMap((note) => {
        return chordTypes.flatMap((chordType) => {
            const chordSlug = getSlugForChord(note, chordType);
            return notes
                .map((bassNote) => {
                    const bassNoteSlug = getSlugForNote(bassNote);
                    if (bassNote.name === note.name) {
                        // Skip if bass note is the same as the root note
                        return null;
                    }
                    const url = `${SITE_ORIGIN}/chords/${chordSlug}/${bassNoteSlug}/`;
                    return { url, changeFrequency: "yearly", priority: 0.5 };
                })
                .filter(Boolean); // Remove null values
        });
    });
    return chordUrls;
}

function generateChordUrls() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chordUrls = notes.flatMap((note) => {
        return chordTypes.flatMap((chordType) => {
            const chordSlug = getSlugForChord(note, chordType);
            const url = `${SITE_ORIGIN}/chords/${chordSlug}/`;
            return { url, changeFrequency: "yearly", priority: 0.7 };
        });
    });
    return chordUrls;
}

function generateScaleUrls() {
    const notes = getAllNotes();
    const scaleTypes = getAllScaleTypes();
    return notes.flatMap((note) =>
        scaleTypes.map((scaleType) => {
            const scaleSlug = getSlugForScale(note, scaleType);
            return { url: `${SITE_ORIGIN}/scales/${scaleSlug}/`, changeFrequency: "yearly", priority: 0.7 };
        })
    );
}

export async function generateSitemaps() {
    return [{ id: "main" }, { id: "chords" }, { id: "slash-chords" }, { id: "scales" }];
}

export default async function sitemap(props) {
    const id = await props.id;
    const chordUrls = generateChordUrls();
    const slashChordUrls = generateSlashChordUrls();
    switch (id) {
        case "main":
            return [
                { url: `${SITE_ORIGIN}/`, changeFrequency: "monthly", priority: 1 },
                { url: `${SITE_ORIGIN}/chords/`, changeFrequency: "monthly", priority: 0.9 },
                { url: `${SITE_ORIGIN}/scales/`, changeFrequency: "monthly", priority: 0.9 }
            ];
        case "chords":
            return [...chordUrls];
        case "slash-chords":
            return [...slashChordUrls];
        case "scales":
            return generateScaleUrls();
        default:
            return [];
    }
}
