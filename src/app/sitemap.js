import { getAllChordTypes, getAllNotes, getSlugForChord, getSlugForNote } from "@/lib/api";

const ORIGIN = "https://benjamindehli.github.io/music-theory/";
const LAST_MODIFIED = new Date();

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
                    const rootPath = "chords/";
                    const url = `${ORIGIN}${rootPath}${chordSlug}/${bassNoteSlug}`;
                    return { url, lastModified: LAST_MODIFIED };
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
            const rootPath = "chords/";
            const url = `${ORIGIN}${rootPath}${chordSlug}`;
            return { url, lastModified: LAST_MODIFIED };
        });
    });
    return chordUrls;
}

export async function generateSitemaps() {
    // Fetch the total number of products and calculate the number of sitemaps needed
    return [{ id: "sitemap" }, { id: "chords" }, { id: "slash-chords" }];
}

export default async function sitemap(props) {
    const id = await props.id;
    const chordUrls = generateChordUrls();
    switch (id) {
        case "sitemap":
            return [
                {
                    url: ORIGIN,
                    lastModified: LAST_MODIFIED,
                    changeFrequency: "yearly",
                    priority: 1
                }
            ];
        case "chords":
            return [...chordUrls];
        case "slash-chords":
            return generateSlashChordUrls();
        default:
            return [];
    }
}
