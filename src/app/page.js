import { getAllNotes, getAllChordTypes, getSlugForChord } from "@/lib/api";
import Link from "next/link";

export default function Home() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    return (
        <div>
            <main>
                <section>
                    <h2>Chords</h2>
                    {chordTypes
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((chordType) => (
                            <section key={`${chordType.name}`}>
                                <h3>{chordType.name}</h3>
                                <ul>
                                    {notes.map((note) => {
                                        const chordSlug = getSlugForChord(note, chordType);
                                        return (
                                            <li key={chordSlug}>
                                                <Link href={`/chords/${chordSlug}`}>
                                                    {note.name} {chordType.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))}
                </section>
            </main>
        </div>
    );
}
