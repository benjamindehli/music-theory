import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllNotes, getAllChordTypes, getSlugForChord } from "@/lib/api";
import Link from "next/link";

export default async function Chords({ params }) {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const chordClassificationNamesByNumberOfNotes = {
        1: "Monads (single notes)",
        2: "Dyads",
        3: "Triads",
        4: "Tetrads",
        5: "Pentads",
        6: "Hexads",
        7: "Heptads",
        8: "Octads",
        9: "Nonads",
        10: "Decads",
        11: "Undecads",
        12: "Dodecads"
    };
    const chordTypesGroupedByNumberOfNotes = chordTypes.reduce((acc, chordType) => {
        const numberOfNotes = chordType.halfSteps.length;
        if (!acc[numberOfNotes]) {
            acc[numberOfNotes] = [];
        }
        acc[numberOfNotes].push(chordType);
        return acc;
    }, {});
    return (
        <>
            <Breadcrumbs params={params} />
            <main>
                <section>
                    <h1>Chords</h1>
                    {Object.entries(chordTypesGroupedByNumberOfNotes)
                        .sort((a, b) => a[0] - b[0])
                        .map(([numberOfNotes, chordTypes]) => (
                            <section key={numberOfNotes}>
                                <h2>{chordClassificationNamesByNumberOfNotes[numberOfNotes] || `${numberOfNotes}-note`} chords</h2>
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
                        ))}
                </section>
            </main>
        </>
    );
}
