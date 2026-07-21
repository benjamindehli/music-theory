const intervalColors = [
    "#dc2626",
    "#d97706",
    "#65a30d",
    "#059669",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
    "#c026d3",
    "#e11d48",
    "#ea580c",
    "#ca8a04",
    "#16a34a",
    "#0d9488",
    "#0284c7",
    "#4f46e5",
    "#9333ea",
    "#db2777",
    "#991b1b",
    "#92400e",
    "#3f6212",
    "#065f46",
    "#155e75",
    "#1e40af",
    "#5b21b6",
    "#86198f",
    "#9f1239",
    "#9a3412",
    "#854d0e",
    "#166534",
    "#115e59",
    "#075985",
    "#3730a3",
    "#6b21a8",
    "#9d174d"
];
const bassNoteColor = "#f59e0b";
const notesOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Converts a note to its corresponding MIDI number.
 * @param {string|object|number} note - The note to convert. Can be a string (e.g. "C4"), an object with a name property (e.g. { name: "C4" }), or a MIDI number.
 * @returns {number|null} The MIDI number of the note, or null if the note is invalid.
 */
function noteToMidi(note) {
    if (typeof note === "number") return note;
    const noteStr = typeof note === "string" ? note : note?.name;
    const match = noteStr?.match(/^([A-G]#?)(-?\d+)$/);
    if (!match) return null;
    const [, pitch, octave] = match;
    return notesOrder.indexOf(pitch) + (Number.parseInt(octave) + 1) * 12;
}

/**
 * Returns a color for the given note based on its interval from the root note. If the note or root note is invalid, returns the fallback color.
 * @param {string|object} note - The note to get the color for. Can be a string (e.g. "C4") or an object with a name property (e.g. { name: "C4" }), or a MIDI number.
 * @param {number} rootNoteMidi - The MIDI number of the root note.
 * @param {string} fallbackColor - The color to return if the note or root note is invalid.
 * @returns {string} The color corresponding to the interval of the note from the root note, or the fallback color if invalid.
 */
function getIntervalColor(note, rootNoteMidi, fallbackColor) {
    const midi = noteToMidi(note);
    if (midi === null || rootNoteMidi === null) {
        return fallbackColor;
    }
    const interval = (midi - rootNoteMidi + 120) % 12; // +120 to ensure positive
    return intervalColors[interval] || fallbackColor;
}

/**
 * Generates an SVG representation of a piano keyboard with active notes highlighted.
 * @param {Array<string|object|number>} activeNotes - The notes to highlight. Can be strings (e.g. "C4"), objects with a name property (e.g. { name: "C4" }), or MIDI numbers.
 * @param {object} options - Configuration options for the SVG.
 * @returns {string} The SVG markup for the piano keyboard.
 */
export function generatePianoSVG(activeNotes = [], options = {}) {
    const {
        whiteKeyWidth = 40,
        whiteKeyHeight = 180,
        blackKeyWidth = 24,
        blackKeyHeight = 110,
        activeColor = "#6ea5ea",
        whiteColor = "#fdfcf9",
        blackColor = "#1b1a19",
        strokeColor = "#121110",
        showLabels = true,
        showBlackKeyLabels = true,
        fontSize = 12,
        fontFamily = "Arial, sans-serif"
    } = options;
    const noteSelectionTypeProperty = options.chordType ? "chordType" : options.scaleType ? "scaleType" : null;

    // Normalize input → MIDI numbers
    const midiNotesRaw = activeNotes.map((n) => (typeof n === "number" ? n : noteToMidi(n))).filter((n) => n !== null);

    if (midiNotesRaw.length === 0) return "";

    // --- Bass note and shifted chord notes ---
    let bassNoteMidi = options.bassNote === undefined ? null : noteToMidi(options.bassNote);
    let chordNotesRaw = midiNotesRaw;
    if (bassNoteMidi !== null) {
        // Remove all occurrences of the bass note from chordNotes for shifting
        chordNotesRaw = midiNotesRaw.filter((n) => n !== bassNoteMidi);
    }
    // The notes to render: always include bass at original, and all other chord / scale notes an octave higher
    let renderMidiNotes = [];
    if (bassNoteMidi === null) {
        renderMidiNotes = midiNotesRaw;
    } else {
        renderMidiNotes = [bassNoteMidi, ...chordNotesRaw.map((n) => n + 12)];
    }

    // --- Auto range detection ---
    const minMidi = Math.min(...renderMidiNotes);
    const maxMidi = Math.max(...renderMidiNotes);

    // Snap start DOWN to nearest C (position 0) or F (position 5)
    const minNoteInOctave = minMidi % 12;
    const startMidi = minNoteInOctave >= 5
        ? minMidi - minNoteInOctave + 5   // snap to F of the same octave
        : minMidi - minNoteInOctave;       // snap to C of the same octave

    // Snap end UP to nearest C (position 0), E (position 4), or B (position 11)
    const maxNoteInOctave = maxMidi % 12;
    const endMidi = maxNoteInOctave === 0
        ? maxMidi                              // already at C, end here
        : maxNoteInOctave <= 4
            ? maxMidi - maxNoteInOctave + 4    // snap to E of the same octave
            : maxMidi - maxNoteInOctave + 11;  // snap to B of the same octave

    // Build a map of white key MIDI numbers to their x positions and indices
    const whitePositionsInOctave = new Set([0, 2, 4, 5, 7, 9, 11]);
    const blackPositionsInOctave = new Set([1, 3, 6, 8, 10]);
    let whiteKeyCount = 0;
    const whiteKeyByMidi = {}; // midi → { x, index }

    for (let midi = startMidi; midi <= endMidi; midi++) {
        if (whitePositionsInOctave.has(midi % 12)) {
            whiteKeyByMidi[midi] = { x: whiteKeyCount * whiteKeyWidth, index: whiteKeyCount };
            whiteKeyCount++;
        }
    }

    // Use MIDI numbers for matching activeness
    const normalizedMidiNotes = new Set(renderMidiNotes);

    let svgWidth = whiteKeyWidth * whiteKeyCount;
    let svgHeight = whiteKeyHeight;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // --- Determine root note for interval calculation ---
    let rootNoteMidi = null;
    if (options.rootNote) {
        rootNoteMidi = noteToMidi(options.rootNote);
    } else if (midiNotesRaw.length > 0) {
        rootNoteMidi = Math.min(...midiNotesRaw);
    }

    // --- WHITE KEYS ---
    for (let midi = startMidi; midi <= endMidi; midi++) {
        if (!whitePositionsInOctave.has(midi % 12)) continue;
        const { x } = whiteKeyByMidi[midi];
        const isActive = normalizedMidiNotes.has(midi);
        // Highlighted keys use the chord/scale's correct enharmonic spelling (e.g. "Bb");
        // reference keys keep the neutral sharp name.
        const noteName = (isActive && options.spelledNoteNames?.[midi % 12]) || notesOrder[midi % 12];
        const isBass = bassNoteMidi !== null && midi === bassNoteMidi;
        const fillColor = isBass ? bassNoteColor : isActive ? getIntervalColor(midi, rootNoteMidi, activeColor) : whiteColor;

        svg += `
        <rect x="${x}" y="0"
              width="${whiteKeyWidth}" height="${whiteKeyHeight}"
              fill="${fillColor}"
              stroke="${strokeColor}"/>
      `;

        // Labels (white keys)
        if (showLabels) {
            svg += `
          <text x="${x + whiteKeyWidth / 2}"
                y="${whiteKeyHeight - 10}"
                font-size="${fontSize}"
                font-family="${fontFamily}"
                text-anchor="middle"
                fill="#000">
            ${noteName}
          </text>
        `;
        }
    }

    // --- BLACK KEYS ---
    for (let midi = startMidi; midi <= endMidi; midi++) {
        if (!blackPositionsInOctave.has(midi % 12)) continue;
        const prevWhite = whiteKeyByMidi[midi - 1];
        if (!prevWhite) continue;
        const x = (prevWhite.index + 0.7) * whiteKeyWidth - blackKeyWidth / 2;
        const isActive = normalizedMidiNotes.has(midi);
        // Highlighted keys use the chord/scale's correct enharmonic spelling (e.g. "Gb");
        // reference keys keep the neutral sharp name.
        const noteName = (isActive && options.spelledNoteNames?.[midi % 12]) || notesOrder[midi % 12];
        const isBass = bassNoteMidi !== null && midi === bassNoteMidi;
        const fillColor = isBass ? bassNoteColor : isActive ? getIntervalColor(midi, rootNoteMidi, activeColor) : blackColor;

        svg += `
        <rect x="${x + blackKeyWidth / 2}" y="0"
              width="${blackKeyWidth}" height="${blackKeyHeight}"
              fill="${fillColor}"
              stroke="${strokeColor}"/>
      `;

        // Labels (black keys optional)
        if (showLabels && showBlackKeyLabels) {
            svg += `
          <text x="${x + blackKeyWidth}"
                y="${blackKeyHeight - 10}"
                font-size="${fontSize}"
                font-family="${fontFamily}"
                text-anchor="middle"
                fill="#fff">
            ${noteName}
          </text>
        `;
        }
    }

    svg += `
      <text x="${svgWidth / 2}" y="${svgHeight / 2 + fontSize * 5}"
            font-size="${fontSize * 2.75}"
            font-family="${fontFamily}"
            font-weight="bold"
            text-anchor="middle"
            fill="#000" opacity="0.12"
            stroke="#fff" stroke-width="1.25" stroke-opacity="0.95">
        dehlimusikk.no
      </text>
    `;

    // --- LEGEND ---
    // If intervals array is provided in options, render a legend
    let legendSvg = "";
    let legendHeight = 0;
    if (options.intervals && Array.isArray(options.intervals) && Array.isArray(options?.[noteSelectionTypeProperty]?.halfSteps)) {
        // Only show intervals used in the chord, no duplicates
        const usedIntervalNumbers = Array.from(new Set(options?.[noteSelectionTypeProperty]?.halfSteps.map((h) => h % 12)));
        const usedIntervals = usedIntervalNumbers.map((num) => options.intervals.find((ivl) => ivl.number % 12 === num)).filter(Boolean);
        // Legend layout (vertical)
        const legendBoxWidth = 24;
        const legendBoxHeight = 24;
        const legendSpacing = 8;
        const legendFontSize = fontSize;
        const legendX = 12;
        const legendYStart = svgHeight + 16;
        // Escape XML special characters in text
        function escapeXml(str) {
            return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        }
        // Add bass note to the top of the legend if present
        let legendItems = [];
        if (bassNoteMidi !== null) {
            legendItems.push({
                color: bassNoteColor,
                label: escapeXml(options.bassNoteLabel || "Bass note")
            });
        }
        usedIntervals.forEach((interval) => {
            legendItems.push({
                color: intervalColors[interval.number % intervalColors.length],
                label: escapeXml(interval.fullName || interval.name)
            });
        });
        legendHeight = legendItems.length * (legendBoxHeight + legendSpacing) + 24;

        legendItems.forEach((item, i) => {
            const y = legendYStart + i * (legendBoxHeight + legendSpacing);
            legendSvg += `
    <rect x="${legendX}" y="${y}" width="${legendBoxWidth}" height="${legendBoxHeight}" fill="${item.color}" stroke="${strokeColor}" rx="6"/>
    `;
            legendSvg += `<text x="${legendX + legendBoxWidth + 10}" y="${y + legendBoxHeight / 2 + legendFontSize / 2.5}" font-size="${legendFontSize}" font-family="${fontFamily}" text-anchor="start" fill="#000">${item.label}</text>
    `;
        });
    }
    // --- FINAL SVG ASSEMBLY ---
    // Update SVG height if legend is present
    let totalSvgHeight = svgHeight + legendHeight;
    // Replace the height attribute in the opening tag
    svg = svg.replace(/(height=")([0-9]+)(")/i, (m, pre, h, post) => `${pre}${totalSvgHeight}${post}`);
    // Insert legend before closing </svg>
    let svgCloseTag = "</svg>";
    let lastIndex = svg.lastIndexOf(svgCloseTag);
    if (legendSvg) {
        if (lastIndex === -1) {
            svg += legendSvg;
        } else {
            svg = svg.slice(0, lastIndex) + legendSvg + svgCloseTag;
        }
    }
    // Ensure only one closing </svg> and one height attribute
    svg = svg.replace(/(<svg[^>]*)(height="[0-9]+")([^>]*)(height="[0-9]+")/i, "$1$2$3"); // Remove duplicate height
    // Guarantee a single closing </svg> at the end
    svg = svg.replaceAll(/(<\/svg>)+$/g, "");
    svg += "</svg>";
    return svg;
}
