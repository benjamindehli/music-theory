import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllNotes, getAllChordTypes, getChordRootDisplayName, getSlugForChord } from "@/lib/api";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Browse all chords",
    description: "Browse the complete chord library — all chord types for every root note, organized by triads, tetrads, and beyond.",
    alternates: {
        canonical: "https://benjamindehli.github.io/music-theory/chords/"
    },
    openGraph: {
        type: "website",
        url: "https://benjamindehli.github.io/music-theory/chords/"
    }
};

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
            <Breadcrumbs params={params} section="chords" />
            <main className={styles.main}>
                <h1 className={styles.heading}>Chords</h1>
                {Object.entries(chordTypesGroupedByNumberOfNotes)
                    .sort((a, b) => a[0] - b[0])
                    .map(([numberOfNotes, chordTypes]) => (
                        <section key={numberOfNotes} className={styles.group}>
                            <h2 className={styles.groupHeading}>
                                {chordClassificationNamesByNumberOfNotes[numberOfNotes] || `${numberOfNotes}-note`} chords
                            </h2>
                            {chordTypes
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((chordType) => (
                                    <section key={`${chordType.name}`} className={styles.chordType}>
                                        <h3 className={styles.chordTypeHeading}>{chordType.name}</h3>
                                        <ul className={styles.noteList}>
                                            {notes.map((note) => {
                                                const chordSlug = getSlugForChord(note, chordType);
                                                return (
                                                    <li key={chordSlug}>
                                                        <Link href={`/chords/${chordSlug}`}>
                                                            {getChordRootDisplayName(note, chordType)} {chordType.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </section>
                                ))}
                        </section>
                    ))}
            </main>
        </>
    );
}
