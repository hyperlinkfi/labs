import chroma from "chroma-js";

const colors = {
  red: { hex: "#71002e", generateLuminance: true },
  green: { hex: "#066839", generateLuminance: true },
  blue: { hex: "#125476", generateLuminance: true },
  orange: { hex: "#b4521f", generateLuminance: true },
  cream: { hex: "#ffeaca", generateLuminance: true },
  gray: { hex: "#44413e", generateLuminance: true },
  danger: { hex: "#cc0000", generateLuminance: false },
  success: { hex: "#38a33d", generateLuminance: false },
  warning: { hex: "#cc8800", generateLuminance: false },
  white: { hex: "#ffffff", generateLuminance: false },
  black: { hex: "#000000", generateLuminance: false },
};

// Target luminance levels
const luminanceLevels = {
  1: 240,
  2: 220,
  3: 170,
  4: 120,
  5: 80,
  6: 50,
  7: 20,
  8: 5,
  9: 2,
};

// Create color variations
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
  // Add base colors
  baseHex.push(`--${name}: ${hex};`);
  const [h, s, l] = chroma(hex)
    .hsl()
    .map((x, i) => (i === 0 ? Math.round(x) : Math.round(x * 100)));
  baseHsl.push(`--${name}-hsl: ${isNaN(h) ? 0 : h}, ${isNaN(s) ? 0 : s}%, ${l}%;`);

  if (generateLuminance) {
    // Add luminance variations
    const variations = createColorVariations(hex, luminanceLevels);
    variations.forEach(({ level, color }) => {
      luminanceHex.push(`--${name}-${level}: ${color};`);
      const [h, s, l] = chroma(color)
        .hsl()
        .map((x, i) => (i === 0 ? Math.round(x) : Math.round(x * 100)));
      luminanceHsl.push(
        `--${name}-${level}-hsl: ${isNaN(h) ? 0 : h}, ${isNaN(s) ? 0 : s}%, ${l}%;`
      );
    });
  }
});

// Print results in the correct format
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
