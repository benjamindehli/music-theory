import Link from "next/link";
import MusicSearch from "@/components/MusicSearch";
import { getAllNotes, getAllChordTypes, getAllScaleTypes, getChordRootDisplayName, getScaleRootDisplayName, getSlugForChord, getSlugForScale } from "@/lib/api";
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

    // `label` shows the correctly-spelled root (e.g. "Eb major"); `keywords` also
    // includes the canonical enharmonic (e.g. "D#") so searching either spelling works.
    const chords = notes.flatMap((note) =>
        chordTypes.map((chordType) => {
            const rootName = getChordRootDisplayName(note, chordType);
            return {
                label: `${rootName} ${chordType.name}`,
                keywords: `${rootName} ${note.name} ${chordType.name}`,
                slug: getSlugForChord(note, chordType)
            };
        })
    );

    const scales = notes.flatMap((note) =>
        scaleTypes.map((scaleType) => {
            const rootName = getScaleRootDisplayName(note, scaleType);
            return {
                label: `${rootName} ${scaleType.name}`,
                keywords: `${rootName} ${note.name} ${scaleType.name}`,
                slug: getSlugForScale(note, scaleType)
            };
        })
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
