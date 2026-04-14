import Link from "next/link";

export const metadata = {
    title: "Music theory",
    description: "Interactive music theory reference covering chords, intervals, and piano keyboard diagrams."
};

export default function Home() {
    return (
        <div>
            <main>
                <h1>Music theory</h1>
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
