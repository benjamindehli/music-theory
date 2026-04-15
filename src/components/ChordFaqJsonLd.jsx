function formatList(items) {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function ChordFaqJsonLd({ chord, intervalsForChordType, bassNote }) {
    const chordName = `${chord.rootNote.name} ${chord.chordType.name}`;
    const fullChordName = bassNote ? `${chordName}/${bassNote.name}` : chordName;

    const noteWithIntervalItems = intervalsForChordType.map(
        (interval) => `${interval.relativeNote.name} (${interval.fullName})`
    );
    const noteWithIntervalList = formatList(noteWithIntervalItems);
    const noteNameItems = intervalsForChordType.map((interval) => interval.relativeNote.name);
    const noteNameList = formatList(noteNameItems);
    const noteCount = intervalsForChordType.length;
    const noteWord = noteCount === 1 ? "note" : "notes";

    let mainEntity;

    if (bassNote) {
        mainEntity = [
            {
                "@type": "Question",
                name: `How do you play the ${fullChordName} chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `To play the ${fullChordName} chord on piano, play the ${chordName} chord (${noteNameList}) with ${bassNote.name} as the lowest bass note. Place the ${bassNote.name} note below the other chord tones. Slash chords specify a particular bass note different from the chord root.`
                }
            },
            {
                "@type": "Question",
                name: `What notes are in the ${fullChordName} chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The ${fullChordName} chord uses the ${noteCount} ${noteWord} of the ${chordName} chord — ${noteWithIntervalList} — with ${bassNote.name} played as the bass note in the lowest register.`
                }
            },
            {
                "@type": "Question",
                name: `What is a slash chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `A slash chord (or compound chord) is written as Chord/Bass and specifies both a chord and a bass note. The note to the right of the slash is played as the lowest note. The ${fullChordName} chord means a ${chordName} chord with ${bassNote.name} in the bass.`
                }
            }
        ];
    } else {
        mainEntity = [
            {
                "@type": "Question",
                name: `How do you play the ${chordName} chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `To play the ${chordName} chord on piano, press the following ${noteCount === 1 ? "key" : "keys"} simultaneously: ${noteWithIntervalList}. Find these ${noteWord} on the piano keyboard and press them all at the same time to sound the ${chordName} chord.`
                }
            },
            {
                "@type": "Question",
                name: `What notes are in the ${chordName} chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The ${chordName} chord consists of ${noteCount} ${noteWord}: ${noteNameList}. These ${noteWord} together form the ${chordName} chord.`
                }
            },
            {
                "@type": "Question",
                name: `What intervals make up the ${chordName} chord?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `The ${chordName} chord contains the following intervals from its root note (${chord.rootNote.name}): ${noteWithIntervalList}.`
                }
            }
        ];
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
            }}
        />
    );
}
