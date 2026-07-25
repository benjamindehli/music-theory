import { getScaleNounSuffix } from "@/lib/api";

export default function ScaleHowToJsonLd({ scale, intervalsForScaleType }) {
    const scaleName = `${scale.rootNote.name} ${scale.scaleType.name}`;
    const scaleLabel = `${scaleName}${getScaleNounSuffix(scale.scaleType)}`;
    const nonRootIntervals = intervalsForScaleType.filter((i) => i.number > 0);
    const noteCount = intervalsForScaleType.length;

    const steps = [];
    let position = 1;

    steps.push({
        "@type": "HowToStep",
        position: position++,
        text: `Find ${scale.rootNote.name} (Root) on the piano keyboard`
    });

    for (const interval of nonRootIntervals) {
        steps.push({
            "@type": "HowToStep",
            position: position++,
            text: `Add ${interval.relativeNote.name} (${interval.fullName}) — ${interval.number} ${interval.number === 1 ? "semitone" : "semitones"} above ${scale.rootNote.name}`
        });
    }

    steps.push({
        "@type": "HowToStep",
        position: position,
        text: `Play all ${noteCount} notes in ascending order to perform the ${scaleLabel}`
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to play the ${scaleLabel} on piano`,
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
