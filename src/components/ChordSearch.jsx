"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./ChordSearch.module.css";

export default function ChordSearch({ chords }) {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return chords.filter(({ label }) => label.toLowerCase().includes(q)).slice(0, 20);
    }, [query, chords]);

    return (
        <div className={styles.search}>
            <label htmlFor="chord-search" className={styles.label}>
                Search chords
            </label>
            <input
                id="chord-search"
                type="search"
                className={styles.input}
                placeholder="e.g. C major, minor 7th…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
            />
            {query.trim() && (
                results.length > 0 ? (
                    <ul className={styles.results}>
                        {results.map(({ label, slug }) => (
                            <li key={slug}>
                                <Link href={`/chords/${slug}`}>{label}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noResults}>No chords found for &ldquo;{query.trim()}&rdquo;</p>
                )
            )}
        </div>
    );
}
