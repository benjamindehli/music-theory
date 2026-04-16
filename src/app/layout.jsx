import SiteJsonLd from "@/components/SiteJsonLd";
import "./globals.css";

export const metadata = {
    title: {
        template: "%s | Music theory",
        default: "Music theory"
    },
    description: "A web app for exploring music theory concepts, including chords, scales, and intervals.",
    openGraph: {
        siteName: "Music theory",
        locale: "en_US"
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
