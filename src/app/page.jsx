import Link from "next/link";
import ChordSearch from "@/components/ChordSearch";
import { getAllNotes, getAllChordTypes, getSlugForChord } from "@/lib/api";

export const metadata = {
    title: "Music theory",
    description: "Interactive music theory reference covering chords, intervals, and piano keyboard diagrams."
};

export default function Home() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chords = notes.flatMap((note) =>
        chordTypes.map((chordType) => ({
            label: `${note.name} ${chordType.name}`,
            slug: getSlugForChord(note, chordType)
        }))
    );

    return (
        <div>
            <main>
                <h1>Music theory</h1>
                <section>
                    <h2>Chords</h2>
                    <ChordSearch chords={chords} />
                    <ul>
                        <li>
                            <Link href="/chords">All Chords</Link>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
