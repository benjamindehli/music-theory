import { getSlugForChord, getSlugForNote } from "@/lib/api";
import Link from "next/link";
import PropTypes from "prop-types";

function renderImageFigure(imagesWithDimensions) {
    return (
        <figure>
            <picture>
                <source srcSet={imagesWithDimensions.png.url} type="image/png" />
                <source srcSet={imagesWithDimensions.svg.url} type="image/svg+xml" />
                <img src={imagesWithDimensions.png.url} alt="piano" height={imagesWithDimensions.png.height} width={imagesWithDimensions.png.width} />
            </picture>
        </figure>
    );
}

function filterChordMatchesByType(chordMatches, type) {
    return chordMatches.filter((match) => match.matchType === type).map((match) => match.chord);
}

export default async function ChordInfo({ chord, intervalsForChordType, imagesWithDimensions, chordMatches }) {
    const exactRootMatches = filterChordMatchesByType(chordMatches, "exactRoot"); // Same root and intervals, different chord name
    const invertedRootMatches = filterChordMatchesByType(chordMatches, "invertedRoot"); // Inversion with same root
    const nonRootMatches = filterChordMatchesByType(chordMatches, "nonRoot"); // Different root
    const slashChordMatches = filterChordMatchesByType(chordMatches, "slashChord"); // Slash chord
    return (
        <div>
            <main>
                <h1>
                    {chord?.rootNote?.name?.toUpperCase()}
                    {chord?.chordType?.name}
                </h1>
                <p>
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
                {renderImageFigure(imagesWithDimensions)}
                {exactRootMatches?.length > 0 && (
                    <div>
                        <h2>Related chords with same root</h2>
                        <ul>
                            {exactRootMatches.map((match) => (
                                <li key={`${match.rootNote.name}-${match.chordType.name}-same-root-${match.chordType.name}`}>
                                    <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}`}>
                                        {match.rootNote.name}
                                        {match.chordType.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {invertedRootMatches?.length > 0 && (
                    <div>
                        <h2>Inversions with same root</h2>
                        <ul>
                            {invertedRootMatches.map((match) => (
                                <li key={`${match.rootNote.name}-${match.chordType.name}-inverted-root-${match.chordType.name}`}>
                                    <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}`}>
                                        {match.rootNote.name}
                                        {match.chordType.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {nonRootMatches?.length > 0 && (
                    <div>
                        <h2>Related chords with different root</h2>
                        <ul>
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
                    </div>
                )}
                {slashChordMatches?.length > 0 && (
                    <div>
                        <h2>Related slash chords</h2>
                        <ul>
                            {slashChordMatches.map((match) => (
                                <li key={`${match.rootNote.name}-${match.chordType.name}-slash-${match.bassNote.name}`}>
                                    <Link href={`/chords/${getSlugForChord(match.rootNote, match.chordType)}/${getSlugForNote(match.bassNote)}`}>
                                        {match.rootNote.name}
                                        {match.chordType.name}/{match.bassNote.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}

ChordInfo.propTypes = {
    chord: PropTypes.shape({
        rootNote: PropTypes.shape({
            name: PropTypes.string
        }),
        chordType: PropTypes.shape({
            name: PropTypes.string
        })
    }),
    intervalsForChordType: PropTypes.array,
    chordMatches: PropTypes.array,
    imagesWithDimensions: PropTypes.array
};
