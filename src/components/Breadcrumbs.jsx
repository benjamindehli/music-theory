import { getChordBySlug, getNoteBySlug, getScaleBySlug } from "@/lib/api";
import { SITE_ORIGIN } from "@/lib/constants";
import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

const renderBreadcrumbJsonLd = (breadcrumbs) => {
    const originUrl = SITE_ORIGIN;
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

export default async function Breadcrumbs({ params, section }) {
    params = await params;
    const crumbs = [{ href: "/", label: "Music theory" }];

    // CHORDS
    if (section === "chords" || params?.chordSlug) {
        crumbs.push({ href: "/chords/", label: "Chords" });
    }

    if (params?.chordSlug) {
        const chord = getChordBySlug(params.chordSlug);
        crumbs.push({
            href: `/chords/${params.chordSlug}/`,
            label: (chord ? `${chord.rootNote.name} ${chord.chordType.name}` : params.chordSlug) + " chord"
        });
    }

    if (params?.bassNoteSlug) {
        const bassNote = getNoteBySlug(params.bassNoteSlug);
        crumbs.push({
            href: `/chords/${params.chordSlug}/${params.bassNoteSlug}/`,
            label: `${bassNote ? bassNote.name : params.bassNoteSlug} (bass note)`
        });
    }

    // SCALES
    if (section === "scales" || params?.scaleSlug) {
        crumbs.push({ href: "/scales/", label: "Scales" });
    }

    if (params?.scaleSlug) {
        const scale = getScaleBySlug(params.scaleSlug);
        crumbs.push({
            href: `/scales/${params.scaleSlug}/`,
            label: scale ? `${scale.rootNote.name} ${scale.scaleType.name}` : params.scaleSlug
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
            <nav aria-label="Breadcrumb" className={styles.nav}>
                {crumbs.map((c, i) => (
                    <span key={c.href} className={styles.crumb}>
                        {i < crumbs.length - 1 ? (
                            <Link href={c.href}>{c.label}</Link>
                        ) : (
                            <span aria-current="page" className={styles.current}>{c.label}</span>
                        )}
                        {i < crumbs.length - 1 && (
                            <span className={styles.separator} aria-hidden="true">/</span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    );
}
