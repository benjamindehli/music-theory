import "./globals.css";

export const metadata = {
    title: {
        template: "%s | Music theory",
        default: "Music theory"
    },
    description: {
        template: "%s",
        default: "A web app for exploring music theory concepts, including chords, scales, and intervals."
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
                <footer style={{ textAlign: "center", padding: "2rem 0" }}>
                    <small>
                        Made by{" "}
                        <a href="https://www.dehlimusikk.no" target="_blank" rel="noopener noreferrer">
                            Benjamin Dehli / Dehli Musikk
                        </a>
                    </small>
                </footer>
            </body>
        </html>
    );
}
