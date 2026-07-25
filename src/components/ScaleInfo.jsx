import { getScaleNounSuffix, getSlugForChord, getSlugForScale } from "@/lib/api";
import Link from "next/link";
import styles from "./ScaleInfo.module.css";

function renderImageFigure(imagesWithDimensions, scale) {
    const scaleLabel = `${scale?.rootNote?.name} ${scale?.scaleType?.name}${getScaleNounSuffix(scale?.scaleType)}`;
    return (
        <figure>
            <picture>
                <source srcSet={imagesWithDimensions.svg.url} type="image/svg+xml" />
                <source srcSet={imagesWithDimensions.png.url} type="image/png" />
                <img
                    src={imagesWithDimensions.png.url}
                    alt={`Piano keyboard showing the notes for the ${scaleLabel}`}
                    height={imagesWithDimensions.png.height}
                    width={imagesWithDimensions.png.width}
                />
            </picture>
        </figure>
    );
}

export default function ScaleInfo({ scale, intervalsForScaleType, scaleMatches, chordsInScale, imagesWithDimensions }) {
    const sameRootMatches = scaleMatches.filter((m) => m.scale.rootNote.name === scale?.rootNote?.name).map((m) => m.scale);
    const differentRootMatches = scaleMatches.filter((m) => m.scale.rootNote.name !== scale?.rootNote?.name).map((m) => m.scale);
    const scaleLabel = `${scale?.rootNote?.name} ${scale?.scaleType?.name}${getScaleNounSuffix(scale?.scaleType)}`;

    const chordsByRoot = chordsInScale?.reduce((acc, chord) => {
        const key = chord.rootNote.name;
        if (!acc[key]) acc[key] = { rootNote: chord.rootNote, chords: [] };
        acc[key].chords.push(chord);
        return acc;
    }, {});
    const chordGroups = chordsByRoot ? Object.values(chordsByRoot) : [];

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>
                {scale?.rootNote?.name} {scale?.scaleType?.name}
            </h1>
            <p className={styles.description}>
                The {scaleLabel} consists of the{" "}
                {intervalsForScaleType?.length
                    ? (() => {
                          const items = intervalsForScaleType.map((interval) => `${interval.relativeNote?.name} (${interval.fullName})`);
                          if (items.length === 1) return items[0];
                          if (items.length === 2) return items.join(" and ");
                          return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
                      })()
                    : ""}{" "}
                {intervalsForScaleType?.length === 1 ? "note" : "notes"}.
            </p>
            {imagesWithDimensions && <div className={styles.diagram}>{renderImageFigure(imagesWithDimensions, scale)}</div>}
            {scale && intervalsForScaleType && (
                <section className={styles.howToSection}>
                    <h2 className={styles.howToTitle}>How to play the {scaleLabel}</h2>
                    <ol className={styles.howToSteps}>
                        <li>
                            Find <strong>{scale.rootNote.name}</strong> (Root) on the piano keyboard
                        </li>
                        {intervalsForScaleType.filter((i) => i.number > 0).map((interval) => (
                            <li key={interval.number}>
                                Play <strong>{interval.relativeNote.name}</strong> ({interval.fullName}) &mdash; {interval.number}{" "}
                                {interval.number === 1 ? "semitone" : "semitones"} above {scale.rootNote.name}
                            </li>
                        ))}
                        <li>Play all {intervalsForScaleType.length} notes in ascending order to perform the {scaleLabel}</li>
                    </ol>
                </section>
            )}
            {sameRootMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Scales with same root</h2>
                    <ul className={styles.scaleList}>
                        {sameRootMatches.map((match) => (
                            <li key={`${match.rootNote.name}-${match.scaleType.name}-same-root`}>
                                <Link href={`/scales/${getSlugForScale(match.rootNote, match.scaleType)}`}>
                                    {match.rootNote.name} {match.scaleType.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {differentRootMatches?.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Scales with same notes</h2>
                    <ul className={styles.scaleList}>
                        {differentRootMatches.map((match) => (
                            <li key={`${match.rootNote.name}-${match.scaleType.name}-different-root`}>
                                <Link href={`/scales/${getSlugForScale(match.rootNote, match.scaleType)}`}>
                                    {match.rootNote.name} {match.scaleType.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {chordGroups.length > 0 && (
                <section className={styles.chordsSection}>
                    <h2 className={styles.chordsTitle}>Chords in this scale</h2>
                    {chordGroups.map(({ rootNote, chords }) => (
                        <div key={rootNote.name} className={styles.chordsGroup}>
                            <h3 className={styles.chordsGroupTitle}>{rootNote.name} chords</h3>
                            <ul className={styles.chordList}>
                                {chords.map((chord) => (
                                    <li key={`${chord.rootNote.name}-${chord.chordType.name}`}>
                                        <Link href={`/chords/${getSlugForChord(chord.rootNote, chord.chordType)}`}>
                                            {chord.rootNote.name} {chord.chordType.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}
