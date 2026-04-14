import { getSlugForChord, getSlugForNote } from "@/lib/api";
import Link from "next/link";
import styles from "./ChordInfo.module.css";

function renderImageFigure(imagesWithDimensions, chord) {
    const chordName = `${chord?.rootNote?.name?.toUpperCase()}${chord?.chordType?.name}`;
    return (
        <figure>
            <picture>
                <source srcSet={imagesWithDimensions.png.url} type="image/png" />
                <source srcSet={imagesWithDimensions.svg.url} type="image/svg+xml" />
                <img
                    src={imagesWithDimensions.png.url}
                    alt={`Piano keyboard showing the notes for a ${chordName} chord`}
                    height={imagesWithDimensions.png.height}
                    width={imagesWithDimensions.png.width}
                />
            </picture>
        </figure>
    );
}

function filterChordMatchesByType(chordMatches, type) {
    return chordMatches.filter((match) => match.matchType === type).map((match) => match.chord);
}

export default async function ChordInfo({ chord, intervalsForChordType, imagesWithDimensions, chordMatches }) {
    const exactRootMatches = filterChordMatchesByType(chordMatches, "exactRoot");
    const invertedRootMatches = filterChordMatchesByType(chordMatches, "invertedRoot");
    const nonRootMatches = filterChordMatchesByType(chordMatches, "nonRoot");
    const slashChordMatches = filterChordMatchesByType(chordMatches, "slashChord");
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>
                {chord?.rootNote?.name?.toUpperCase()}
                {chord?.chordType?.name}
            </h1>
            <p className={styles.description}>
                The {chord?.rootNote?.name?.toUpperCase()}
                {chord?.chordType?.name} chord consists of the{" "}
                {intervalsForChordType?.length
                    ? (() => {
                          const items = intervalsForChordType.map((interval) => `${interval.relativeNote?.name} (${interval.fullName})`);
                          if (items.length === 1) return items[0];
                          if (items.length === 2) return items.join(" and ");
                          return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
                      })()
                    : ""}{" "}
                {intervalsForChordType?.length === 1 ? "note" : "notes"}.
            </p>
            <div className={styles.diagram}>
                {renderImageFigure(imagesWithDimensions, chord)}
            </div>
            {exactRootMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Related chords with same root</h2>
                    <ul className={styles.chordList}>
                        {exactRootMatches.map((match) => (
                            <li key={`${match.rootNote.name}-${match.chordType.name}-same-root-${match.chordType.name}`}>
                                <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}`}>
                                    {match.rootNote.name}
                                    {match.chordType.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {invertedRootMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Inversions with same root</h2>
                    <ul className={styles.chordList}>
                        {invertedRootMatches.map((match) => (
                            <li key={`${match.rootNote.name}-${match.chordType.name}-inverted-root-${match.chordType.name}`}>
                                <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}`}>
                                    {match.rootNote.name}
                                    {match.chordType.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {nonRootMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Related chords with different root</h2>
                    <ul className={styles.chordList}>
                        {nonRootMatches.map((match) => (
                            <li
                                key={`${match.rootNote.name}-${match.chordType.name}-different-root-${match.rootNote.name}-${match.chordType.name}`}
                            >
                                <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}`}>
                                    {match.rootNote.name}
                                    {match.chordType.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {slashChordMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Related slash chords</h2>
                    <ul className={styles.chordList}>
                        {slashChordMatches.map((match) => (
                            <li key={`${match.rootNote.name}-${match.chordType.name}-slash-${match.bassNote.name}`}>
                                <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}/${getSlugForNote(match.bassNote)}`}>
                                    {match.rootNote.name}
                                    {match.chordType.name}/{match.bassNote.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    );
}
