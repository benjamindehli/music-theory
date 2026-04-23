import SiteJsonLd from "@/components/SiteJsonLd";
import "./globals.css";

export const metadata = {
    metadataBase: new URL("https://benjamindehli.github.io"),
    title: {
        template: "%s | Music theory",
        default: "Music theory"
    },
    description: "Interactive music theory reference covering chords, scales, intervals, and piano keyboard diagrams.",
    openGraph: {
        siteName: "Music theory",
        locale: "en_US"
    },
    twitter: {
        card: "summary_large_image"
    }
};

export default async function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <SiteJsonLd />
                <div className="page-layout">
                    <div className="container">
                        {children}
                    </div>
                    <footer className="site-footer">
                        <small>
                            Made by{" "}
                            <a href="https://www.dehlimusikk.no" target="_blank" rel="noopener noreferrer">
                                Benjamin Dehli / Dehli Musikk
                            </a>
                        </small>
                    </footer>
                </div>
            </body>
        </html>
    );
}
