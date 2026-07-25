import { getChordNounSuffix } from "@/lib/api";

export default function ChordHowToJsonLd({ chord, intervalsForChordType, bassNote }) {
    const chordName = `${chord.rootNote.name} ${chord.chordType.name}`;
    const fullChordName = bassNote ? `${chordName}/${bassNote.name}` : chordName;
    const fullChordLabel = `${fullChordName}${getChordNounSuffix(chord.chordType)}`;
    const nonRootIntervals = intervalsForChordType.filter((i) => i.number > 0);
    const noteCount = intervalsForChordType.length + (bassNote ? 1 : 0);

    const steps = [];
    let position = 1;

    if (bassNote) {
        steps.push({
            "@type": "HowToStep",
            position: position++,
            text: `Play ${bassNote.name} as the lowest bass note in the left hand`
        });
    }

    steps.push({
        "@type": "HowToStep",
        position: position++,
        text: `Find ${chord.rootNote.name} (Root) on the piano keyboard`
    });

    for (const interval of nonRootIntervals) {
        steps.push({
            "@type": "HowToStep",
            position: position++,
            text: `Add ${interval.relativeNote.name} (${interval.fullName}) — ${interval.number} ${interval.number === 1 ? "semitone" : "semitones"} above ${chord.rootNote.name}`
        });
    }

    steps.push({
        "@type": "HowToStep",
        position: position,
        text:
            noteCount === 1
                ? `Press the note to sound the ${fullChordLabel}`
                : `Press all ${noteCount} notes simultaneously to sound the ${fullChordLabel}`
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to play the ${fullChordLabel} on piano`,
        step: steps
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
