function formatList(items) {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function ScaleFaqJsonLd({ scale, intervalsForScaleType }) {
    const scaleName = `${scale.rootNote.name} ${scale.scaleType.name}`;
    const noteWithIntervalItems = intervalsForScaleType.map(
        (interval) => `${interval.relativeNote.name} (${interval.fullName})`
    );
    const noteWithIntervalList = formatList(noteWithIntervalItems);
    const noteNameItems = intervalsForScaleType.map((interval) => interval.relativeNote.name);
    const noteNameList = formatList(noteNameItems);
    const noteCount = intervalsForScaleType.length;
    const noteWord = noteCount === 1 ? "note" : "notes";

    const mainEntity = [
        {
            "@type": "Question",
            name: `What notes are in the ${scaleName}?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The ${scaleName} consists of ${noteCount} ${noteWord}: ${noteNameList}. These ${noteWord} together make up the ${scaleName}.`
            }
        },
        {
            "@type": "Question",
            name: `What intervals make up the ${scaleName}?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `The ${scaleName} contains the following intervals from its root note (${scale.rootNote.name}): ${noteWithIntervalList}.`
            }
        },
        {
            "@type": "Question",
            name: `How do you play the ${scaleName} on piano?`,
            acceptedAnswer: {
                "@type": "Answer",
                text: `To play the ${scaleName} on piano, start on ${scale.rootNote.name} and play the following ${noteWord} in ascending order: ${noteWithIntervalList}. Each note is played one at a time, stepping through the scale from the root.`
            }
        }
    ];

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
