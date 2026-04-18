"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./MusicSearch.module.css";

export default function MusicSearch({ chords, scales }) {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        const chordResults = chords
            .filter(({ label }) => label.toLowerCase().includes(q))
            .map((item) => ({ ...item, type: "chord" }));
        const scaleResults = scales
            .filter(({ label }) => label.toLowerCase().includes(q))
            .map((item) => ({ ...item, type: "scale" }));
        return [...chordResults, ...scaleResults].slice(0, 20);
    }, [query, chords, scales]);

    return (
        <div className={styles.search}>
            <label htmlFor="music-search" className={styles.label}>
                Search chords and scales
            </label>
            <input
                id="music-search"
                type="search"
                className={styles.input}
                placeholder="e.g. C major, minor 7th, pentatonic…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
            />
            {query.trim() && (
                results.length > 0 ? (
                    <ul className={styles.results}>
                        {results.map(({ label, slug, type }) => (
                            <li key={`${type}-${slug}`}>
                                <Link href={`/${type}s/${slug}`}>
                                    <span>{label}</span>
                                    <span className={styles.badge}>{type}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noResults}>No results for &ldquo;{query.trim()}&rdquo;</p>
                )
            )}
        </div>
    );
}
