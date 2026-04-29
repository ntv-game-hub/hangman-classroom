import { describe, expect, it } from "vitest";
import {
  createAnswerCells,
  isCorrectLetter,
  isFullAnswerCorrect,
  isSolved,
  normalizeGuessLetter,
  revealCells,
  segmentGraphemes
} from "../shared/gameLogic.js";

describe("hangman game logic", () => {
  it("segments Vietnamese graphemes and keeps spaces separate", () => {
    expect(segmentGraphemes("BÁNH MÌ")).toEqual(["B", "Á", "N", "H", " ", "M", "Ì"]);
    expect(segmentGraphemes("BỨC TRANH")).toEqual(["B", "Ứ", "C", " ", "T", "R", "A", "N", "H"]);
  });

  it("reveals guessed letters while keeping punctuation visible", () => {
    const cells = createAnswerCells("ÁO-DÀI");
    expect(revealCells(cells, ["Á", "D"])).toEqual(["Á", null, "-", "D", null, null]);
  });

  it("checks letters with Vietnamese marks preserved", () => {
    const cells = createAnswerCells("BÁNH");
    expect(isCorrectLetter(cells, normalizeGuessLetter("á").key)).toBe(true);
    expect(isCorrectLetter(cells, normalizeGuessLetter("a").key)).toBe(false);
  });

  it("detects solved words from unique guessed graphemes", () => {
    const cells = createAnswerCells("MẸ MẸ");
    expect(isSolved(cells, ["M"])).toBe(false);
    expect(isSolved(cells, ["M", "Ẹ"])).toBe(true);
  });

  it("accepts full-answer guesses case-insensitively but not accent-insensitively", () => {
    expect(isFullAnswerCorrect("CẦU VỒNG", "cầu vồng")).toBe(true);
    expect(isFullAnswerCorrect("CẦU VỒNG", "cau vong")).toBe(false);
  });
});
