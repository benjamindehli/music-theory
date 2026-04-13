import Link from "next/link";

export default function Home() {
    return (
        <div>
            <main>
                <section>
                    <h2>Chords</h2>
                    <ul>
                        <li>
                            <Link href="/chords">All Chords</Link>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
