import { getChordBySlug, getNoteBySlug } from "@/lib/api";
import Link from "next/link";

const renderBreadcrumbJsonLd = (breadcrumbs) => {
    const originUrl = `https://benjamindehli.github.io/${process.env.PAGES_BASE_PATH}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: `${originUrl}${breadcrumb.href}`,
            name: breadcrumb.label
        }))
    };
    return JSON.stringify(jsonLd);
};

export default async function Breadcrumbs({ params }) {
    params = await params;
    const crumbs = [{ href: "/", label: "Music theory" }];

    // CHORDS
    if (params?.chordSlug) {
        const chord = getChordBySlug(params.chordSlug);

        crumbs.push({
            href: "/chords",
            label: "Chords"
        });

        crumbs.push({
            href: `/chords/${params.chordSlug}`,
            label: (chord ? `${chord.rootNote.name}${chord.chordType.name}` : params.chordSlug) + " chord"
        });
    }

    if (params?.bassNoteSlug) {
        const bassNote = getNoteBySlug(params.bassNoteSlug);
        crumbs.push({
            href: `/chords/${params.chordSlug}/${params.bassNoteSlug}`,
            label: `${bassNote ? bassNote.name : params.bassNoteSlug} (bass note)`
        });
    }

    // SCALES
    if (params?.scaleSlug) {
        crumbs.push({
            href: "/scales",
            label: "Scales"
        });

        crumbs.push({
            href: `/scales/${params.scaleSlug}`,
            label: params.scaleSlug
        });
    }

    const jsonLd = renderBreadcrumbJsonLd(crumbs);
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: jsonLd.replaceAll("<", "\\u003c")
                }}
            />
            <nav aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                    <span key={c.href}>
                        <Link href={c.href}>{c.label}</Link>
                        {i < crumbs.length - 1 && " / "}
                    </span>
                ))}
            </nav>
        </>
    );
}
