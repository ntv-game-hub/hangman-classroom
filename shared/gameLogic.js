const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;

export function normalizeText(value) {
  return String(value ?? "").normalize("NFC");
}

export function compareText(value) {
  return normalizeText(value).trim().toLocaleUpperCase("vi-VN");
}

export function segmentGraphemes(value) {
  const text = normalizeText(value);
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

export function isPlayableCell(value) {
  return LETTER_OR_NUMBER.test(value);
}

export function createAnswerCells(answer) {
  return segmentGraphemes(answer).map((value, index) => ({
    index,
    value,
    key: compareText(value),
    playable: isPlayableCell(value)
  }));
}

export function countPlayableCells(answerCells) {
  return answerCells.filter((cell) => cell.playable).length;
}

export function countUniquePlayableLetters(answerCells) {
  return new Set(answerCells.filter((cell) => cell.playable).map((cell) => cell.key)).size;
}

export function normalizeGuessLetter(value) {
  const letter = segmentGraphemes(value).find(isPlayableCell) || "";
  return {
    value: normalizeText(letter).toLocaleUpperCase("vi-VN"),
    key: compareText(letter)
  };
}

export function isCorrectLetter(answerCells, key) {
  return answerCells.some((cell) => cell.playable && cell.key === key);
}

export function revealCells(answerCells, guessedKeys) {
  const keySet = new Set(guessedKeys);
  return answerCells.map((cell) => {
    if (!cell.playable) return cell.value;
    return keySet.has(cell.key) ? cell.value : null;
  });
}

export function isSolved(answerCells, guessedKeys) {
  const keySet = new Set(guessedKeys);
  return answerCells.every((cell) => !cell.playable || keySet.has(cell.key));
}

export function isFullAnswerCorrect(answer, guess) {
  return compareText(answer).replace(/\s+/g, " ") === compareText(guess).replace(/\s+/g, " ");
}

export function sanitizeCode(value) {
  return normalizeText(value).trim().toLocaleUpperCase("en-US").replace(/[^A-Z0-9]/g, "");
}

export function sanitizeName(value) {
  return normalizeText(value).trim().replace(/\s+/g, " ").slice(0, 32);
}

export function normalizeMode(value) {
  return value === "turns" ? "turns" : "free";
}

export const ILLUSTRATION_THEMES = [
  "balloons",
  "sandcastle",
  "rocket",
  "flower",
  "candles",
  "treasure",
  "robot",
  "rainbow"
];

export function normalizeIllustrationTheme(value) {
  return ILLUSTRATION_THEMES.includes(value) ? value : "balloons";
}
