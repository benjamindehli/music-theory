import { getAllChordTypes, getAllNotes, getSlugForChord, getSlugForNote } from "@/lib/api";
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
                    const url = `${SITE_ORIGIN}/chords/${chordSlug}/${bassNoteSlug}`;
                    return { url };
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
            const url = `${SITE_ORIGIN}/chords/${chordSlug}`;
            return { url };
        });
    });
    return chordUrls;
}

export async function generateSitemaps() {
    // Fetch the total number of products and calculate the number of sitemaps needed
    return [{ id: "main" }, { id: "chords" }, { id: "slash-chords" }];
}

export default async function sitemap(props) {
    const id = await props.id;
    const chordUrls = generateChordUrls();
    const slashChordUrls = generateSlashChordUrls();
    switch (id) {
        case "main":
            return [
                { url: `${SITE_ORIGIN}/` },
                { url: `${SITE_ORIGIN}/chords` }
            ];
        case "chords":
            return [...chordUrls];
        case "slash-chords":
            return [...slashChordUrls];
        default:
            return [];
    }
}
