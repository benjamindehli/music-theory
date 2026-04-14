"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function ChordSearch({ chords }) {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return chords.filter(({ label }) => label.toLowerCase().includes(q)).slice(0, 20);
    }, [query, chords]);

    return (
        <div>
            <label htmlFor="chord-search">Search chords</label>
            <br />
            <input
                id="chord-search"
                type="search"
                placeholder="e.g. C major, minor 7th..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
            />
            {query.trim() && (
                results.length > 0 ? (
                    <ul>
                        {results.map(({ label, slug }) => (
                            <li key={slug}>
                                <Link href={`/chords/${slug}`}>{label}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No chords found for &ldquo;{query.trim()}&rdquo;</p>
                )
            )}
        </div>
    );
}
