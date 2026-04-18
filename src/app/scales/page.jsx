import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllNotes, getAllScaleTypes, getSlugForScale } from "@/lib/api";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Browse all scales",
    description: "Browse the complete scale library — all scale types for every root note, organized by pentatonic, hexatonic, heptatonic, and octatonic scales."
};

export default async function Scales({ params }) {
    const notes = getAllNotes();
    const scaleTypes = getAllScaleTypes();

    const scaleClassificationNamesByNumberOfNotes = {
        5: "Pentatonic",
        6: "Hexatonic",
        7: "Heptatonic",
        8: "Octatonic"
    };

    const scaleTypesGroupedByNumberOfNotes = scaleTypes.reduce((acc, scaleType) => {
        const numberOfNotes = scaleType.halfSteps.length;
        if (!acc[numberOfNotes]) acc[numberOfNotes] = [];
        acc[numberOfNotes].push(scaleType);
        return acc;
    }, {});

    return (
        <>
            <Breadcrumbs params={params} section="scales" />
            <main className={styles.main}>
                <h1 className={styles.heading}>Scales</h1>
                {Object.entries(scaleTypesGroupedByNumberOfNotes)
                    .sort((a, b) => a[0] - b[0])
                    .map(([numberOfNotes, scaleTypes]) => (
                        <section key={numberOfNotes} className={styles.group}>
                            <h2 className={styles.groupHeading}>
                                {scaleClassificationNamesByNumberOfNotes[numberOfNotes] || `${numberOfNotes}-note`} scales
                            </h2>
                            {scaleTypes
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((scaleType) => (
                                    <section key={scaleType.name} className={styles.scaleType}>
                                        <h3 className={styles.scaleTypeHeading}>{scaleType.name}</h3>
                                        <ul className={styles.noteList}>
                                            {notes.map((note) => {
                                                const scaleSlug = getSlugForScale(note, scaleType);
                                                return (
                                                    <li key={scaleSlug}>
                                                        <Link href={`/scales/${scaleSlug}`}>
                                                            {note.name} {scaleType.name}
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
