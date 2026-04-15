import { SITE_ORIGIN } from "@/lib/constants";

const AUTHOR_ID = "https://musicbrainz.org/artist/56639e59-2bb5-40bd-9d5a-97d964298b6f";
const PUBLISHER_ID = "https://www.dehlimusikk.no/";

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${SITE_ORIGIN}/#website`,
            "name": "Music theory",
            "url": `${SITE_ORIGIN}/`,
            "description": "Interactive music theory reference covering chords, intervals, and piano keyboard diagrams.",
            "inLanguage": "en",
            "author": { "@id": AUTHOR_ID },
            "publisher": { "@id": PUBLISHER_ID },
            "license": "https://creativecommons.org/licenses/by-sa/4.0/",
            "sameAs": ["https://github.com/benjamindehli"]
        },
        {
            "@type": "Person",
            "@id": AUTHOR_ID,
            "name": "Benjamin Dehli",
            "url": "https://www.dehlimusikk.no/",
            "description": "Benjamin Dehli is a keyboard player, composer and producer from Norway. Benjamin offers keyboard instrument tracks on recordings for artists and bands through his music business Dehli Musikk.",
            "image": {
                "@type": "ImageObject",
                "url": "https://www.dehlimusikk.no/benjamin-dehli.jpg",
                "contentUrl": "https://www.dehlimusikk.no/benjamin-dehli.jpg",
                "license": "https://creativecommons.org/licenses/by/4.0/legalcode",
                "acquireLicensePage": "https://www.dehlimusikk.no/#contact",
                "copyrightNotice": "Benjamin Dehli",
                "creditText": "Dehli Musikk",
                "creator": { "@id": AUTHOR_ID }
            },
            "brand": { "@id": PUBLISHER_ID },
            "worksFor": { "@id": PUBLISHER_ID },
            "sameAs": [
                "https://www.dehlimusikk.no/",
                "https://store.dehlimusikk.no/",
                "https://www.facebook.com/DehliMusikk/",
                "https://x.com/BenjaminDehli",
                "https://www.instagram.com/benjamindehli/",
                "https://youtube.com/@BenjaminDehli",
                "https://www.linkedin.com/in/benjamindehli/",
                "https://vimeo.com/benjamindehli",
                "https://flickr.com/photos/projectdehli/",
                "https://benjamindehli.tumblr.com/",
                "https://github.com/benjamindehli",
                "https://musicbrainz.org/artist/56639e59-2bb5-40bd-9d5a-97d964298b6f",
                "https://soundcloud.com/benjamin-dehli",
                "https://ko-fi.com/benjamindehli",
                "https://credits.muso.ai/profile/39f5096c-b6bd-41d0-9248-d959da8c4b81",
                "https://credits.muso.ai/profile/120086b1-1215-4d5c-a61d-d992e0b2289e",
                "https://www.discogs.com/artist/6942564-Benjamin-Dehli"
            ]
        },
        {
            "@type": "Organization",
            "@id": PUBLISHER_ID,
            "name": "Dehli Musikk",
            "url": "https://www.dehlimusikk.no/",
            "description": "Dehli Musikk is a local music business based in Bø i Telemark, Norway. Founded by Benjamin Dehli in 2019, it offers keyboard instrument tracks on recordings for artists and bands.",
            "foundingDate": "2019-10-01",
            "founder": { "@id": AUTHOR_ID },
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.dehlimusikk.no/DehliMusikkLogo.png",
                "contentUrl": "https://www.dehlimusikk.no/DehliMusikkLogo.png",
                "license": "https://creativecommons.org/licenses/by/4.0/legalcode",
                "acquireLicensePage": "https://www.dehlimusikk.no/#contact",
                "copyrightNotice": "Benjamin Dehli",
                "creditText": "Dehli Musikk",
                "creator": { "@id": AUTHOR_ID }
            },
            "sameAs": [
                "https://www.dehlimusikk.no/",
                "https://store.dehlimusikk.no/",
                "https://www.facebook.com/DehliMusikk/",
                "https://x.com/BenjaminDehli",
                "https://www.instagram.com/benjamindehli/",
                "https://youtube.com/@BenjaminDehli",
                "https://www.linkedin.com/in/benjamindehli/"
            ]
        }
    ]
};

export default function SiteJsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
            }}
        />
    );
}
