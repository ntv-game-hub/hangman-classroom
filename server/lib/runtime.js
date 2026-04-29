import crypto from "node:crypto";
import { countPlayableCells, countUniquePlayableLetters, revealCells, sanitizeCode } from "../../shared/gameLogic.js";
import { getGame, hasGameCode, listGames } from "./store.js";

export function now() {
  return new Date().toISOString();
}

export function makeId() {
  return crypto.randomUUID();
}

export function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do {
    code = Array.from({ length: 5 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
  } while (hasGameCode(code));
  return code;
}

export function publicCells(answerCells, role) {
  return answerCells.map((cell) => ({
    index: cell.index,
    playable: cell.playable,
    value: role === "host" || !cell.playable ? cell.value : null
  }));
}

export function serializeGuess(guess) {
  return {
    id: guess.id,
    type: guess.type,
    value: guess.value,
    key: guess.key,
    playerId: guess.playerId,
    playerName: guess.playerName,
    correct: guess.correct,
    duplicate: guess.duplicate,
    createdAt: guess.createdAt,
  };
}

export function serializePlayer(player) {
  return {
    id: player.id,
    gameId: player.gameId,
    name: player.name,
    score: player.score,
    lastGuessAt: player.lastGuessAt,
    status: player.status,
    createdAt: player.createdAt
  };
}

export function serializeGame(game, viewer = {}) {
  const role = viewer.role === "host" ? "host" : "player";
  const guessedKeys = game.guesses.filter((guess) => guess.type === "letter" && guess.correct).map((guess) => guess.key);
  const wrongCount = game.guesses.filter((guess) => guess.type === "letter" && !guess.correct && !guess.duplicate).length;
  const state = {
    id: game.id,
    code: game.code,
    answer: role === "host" || game.status !== "active" ? game.answer : undefined,
    answerCells: publicCells(game.answerCells, role),
    revealedLetters: revealCells(game.answerCells, guessedKeys),
    hint: game.hint,
    mode: game.mode,
    maxWrong: game.maxWrong,
    wrongCount,
    wrongLeft: Math.max(0, game.maxWrong - wrongCount),
    playableCount: countPlayableCells(game.answerCells),
    uniqueLetterCount: countUniquePlayableLetters(game.answerCells),
    guesses: game.guesses.map(serializeGuess),
    status: game.status,
    winnerId: game.winnerId,
    currentTurnPlayerId: game.currentTurnPlayerId,
    cooldownMs: game.cooldownMs,
    createdAt: game.createdAt,
    viewer: {
      role,
      playerId: viewer.playerId || null
    }
  };

  if (role === "host") {
    state.players = Array.from(game.players.values()).map(serializePlayer);
    return state;
  }

  const player = viewer.playerId ? game.players.get(viewer.playerId) : null;
  state.players = Array.from(game.players.values()).map(serializePlayer);
  state.player = player ? serializePlayer(player) : null;
  return state;
}

export function serializeGameSummary(game) {
  const wrongCount = game.guesses.filter((guess) => guess.type === "letter" && !guess.correct && !guess.duplicate).length;
  return {
    code: game.code,
    hint: game.hint,
    mode: game.mode,
    wrongLeft: Math.max(0, game.maxWrong - wrongCount),
    maxWrong: game.maxWrong,
    playableCount: countPlayableCells(game.answerCells),
    playerCount: game.players.size,
    status: game.status,
    createdAt: game.createdAt
  };
}

export function listAvailableGames() {
  return listGames()
    .filter((game) => game.status === "active")
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map(serializeGameSummary);
}

export function emitGameList(io) {
  io.emit("games:list", { ok: true, rooms: listAvailableGames() });
}

export function emitHostState(io, game) {
  io.to(`host:${game.id}`).emit("game:state", serializeGame(game, { role: "host" }));
}

export function emitPlayerState(io, game, playerId) {
  io.to(`player:${playerId}`).emit("game:state", serializeGame(game, { role: "player", playerId }));
}

export function emitAllStates(io, game) {
  emitHostState(io, game);
  for (const player of game.players.values()) {
    emitPlayerState(io, game, player.id);
  }
}

export function findGame(rawCode) {
  const code = sanitizeCode(rawCode);
  return getGame(code);
}

export function acknowledge(callback, payload) {
  if (typeof callback === "function") {
    callback(payload);
  }
}

export function sendError(socket, callback, message, code = "BAD_REQUEST") {
  const payload = { ok: false, code, message };
  if (typeof callback === "function") {
    callback(payload);
    return;
  }
  socket.emit("error", payload);
}

export function canHost(game, hostToken) {
  if (!game || !hostToken) {
    return false;
  }
  const expected = Buffer.from(game.hostToken);
  const received = Buffer.from(String(hostToken));
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export function joinViewerRooms(socket, game, viewer) {
  socket.join(`game:${game.id}`);
  if (viewer.role === "host") {
    socket.join(`host:${game.id}`);
  }
  if (viewer.playerId) {
    socket.join(`player:${viewer.playerId}`);
  }
}
