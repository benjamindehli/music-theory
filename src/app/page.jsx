import Link from "next/link";
import ChordSearch from "@/components/ChordSearch";
import { getAllNotes, getAllChordTypes, getAllScaleTypes, getSlugForChord } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
    title: { absolute: "Music theory" },
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
        <main>
            <header className={styles.hero}>
                <h1 className={styles.title}>Music theory</h1>
                <p className={styles.subtitle}>Interactive reference for chords, scales, and intervals.</p>
            </header>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Chords</h2>
                <ChordSearch chords={chords} />
                <Link href="/chords" className={styles.browseLink}>
                    Browse all chords →
                </Link>
            </section>
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Scales</h2>
                <Link href="/scales" className={styles.browseLink}>
                    Browse all scales →
                </Link>
            </section>
        </main>
    );
}
