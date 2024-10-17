import chroma from "chroma-js";

const colors = {
  indigo: { hex: "#4d09b9", generateLuminance: true },
  gray: { hex: "#8c8497", generateLuminance: true },
  danger: { hex: "#cc0000", generateLuminance: true },
  success: { hex: "#38a33d", generateLuminance: true },
  warning: { hex: "#cc8800", generateLuminance: true },
  white: { hex: "#ffffff", generateLuminance: false },
  black: { hex: "#05010c", generateLuminance: false },
};

// Kohdeluminanssit tasoille
const luminanceLevels = {
  50: 250,
  100: 240,
  150: 220,
  200: 200,
  250: 170,
  300: 145,
  350: 123,
  400: 100,
  450: 82,
  500: 65,
  550: 50,
  600: 37,
  650: 27,
  700: 19,
  750: 12,
  800: 7,
  850: 4,
  900: 2,
  950: 1,
};

// Luodaan väriversiot
const createColorVariations = (
  baseColor: string,
  luminanceLevels: { [key: number]: number }
) => {
  const variations = Object.entries(luminanceLevels).map(
    ([level, luminance]) => {
      const normalizedLuminance = luminance / 255;
      return {
        level: Number(level),
        color: chroma(baseColor).luminance(normalizedLuminance).hex(),
      };
    }
  );
  return variations;
};

let baseHex: string[] = [];
let baseHsl: string[] = [];
let luminanceHex: string[] = [];
let luminanceHsl: string[] = [];

Object.entries(colors).forEach(([name, { hex, generateLuminance }]) => {
  // Lisää perusvärit
  baseHex.push(`--${name}: ${hex};`);
  const [h, s, l] = chroma(hex)
    .hsl()
    .map((x, i) => (i === 0 ? Math.round(x) : Math.round(x * 100)));
  baseHsl.push(`--${name}-hsl: ${isNaN(h) ? 0 : h} ${isNaN(s) ? 0 : s}% ${l}%;`);

  if (generateLuminance) {
    // Lisää luminanssiversiot
    const variations = createColorVariations(hex, luminanceLevels);
    variations.forEach(({ level, color }) => {
      luminanceHex.push(`--${name}-${level}: ${color};`);
      const [h, s, l] = chroma(color)
        .hsl()
        .map((x, i) => (i === 0 ? Math.round(x) : Math.round(x * 100)));
      luminanceHsl.push(
        `--${name}-${level}-hsl: ${isNaN(h) ? 0 : h} ${isNaN(s) ? 0 : s}% ${l}%;`
      );
    });
  }
});

// Tulosta tulokset oikeassa muodossa
console.log(
  [
    ":root {",
    ...baseHex,
    "",
    ...luminanceHex,
    "",
    ...baseHsl,
    "",
    ...luminanceHsl,
    "}",
  ].join("\n")
);
