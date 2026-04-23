import Link from "next/link";
import MusicSearch from "@/components/MusicSearch";
import { getAllNotes, getAllChordTypes, getAllScaleTypes, getSlugForChord, getSlugForScale } from "@/lib/api";
import styles from "./page.module.css";

export const metadata = {
    title: { absolute: "Music theory" },
    description: "Interactive music theory reference covering chords, scales, intervals, and piano keyboard diagrams.",
    alternates: {
        canonical: "https://benjamindehli.github.io/music-theory/"
    },
    openGraph: {
        type: "website",
        url: "https://benjamindehli.github.io/music-theory/"
    }
};

export default function Home() {
    const notes = getAllNotes();
    const chordTypes = getAllChordTypes();
    const scaleTypes = getAllScaleTypes();

    const chords = notes.flatMap((note) =>
        chordTypes.map((chordType) => ({
            label: `${note.name} ${chordType.name}`,
            slug: getSlugForChord(note, chordType)
        }))
    );

    const scales = notes.flatMap((note) =>
        scaleTypes.map((scaleType) => ({
            label: `${note.name} ${scaleType.name}`,
            slug: getSlugForScale(note, scaleType)
        }))
    );

    return (
        <main>
            <header className={styles.hero}>
                <h1 className={styles.title}>Music theory</h1>
                <p className={styles.subtitle}>Interactive reference for chords, scales, and intervals.</p>
            </header>
            <section className={styles.section}>
                <MusicSearch chords={chords} scales={scales} />
                <div className={styles.browseLinks}>
                    <Link href="/chords" className={styles.browseLink}>
                        Browse all chords →
                    </Link>
                    <Link href="/scales" className={styles.browseLink}>
                        Browse all scales →
                    </Link>
                </div>
            </section>
        </main>
    );
}
