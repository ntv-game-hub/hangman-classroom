import crypto from "node:crypto";
import {
  createAnswerCells,
  isCorrectLetter,
  isFullAnswerCorrect,
  isSolved,
  normalizeIllustrationTheme,
  normalizeGuessLetter,
  normalizeMode,
  normalizeText,
  sanitizeName
} from "../shared/gameLogic.js";
import { saveGame } from "./lib/store.js";
import {
  acknowledge,
  canHost,
  emitAllStates,
  emitGameList,
  emitHostState,
  findGame,
  joinViewerRooms,
  listAvailableGames,
  makeCode,
  makeId,
  now,
  sendError,
  serializeGame,
  serializePlayer
} from "./lib/runtime.js";

function wrongLetterCount(game) {
  return game.guesses.filter((guess) => guess.type === "letter" && !guess.correct && !guess.duplicate).length;
}

function advanceTurn(game, currentPlayerId) {
  if (game.mode !== "turns") return;
  const players = Array.from(game.players.values()).filter((player) => player.status === "active");
  if (players.length === 0) {
    game.currentTurnPlayerId = null;
    return;
  }
  const currentIndex = Math.max(0, players.findIndex((player) => player.id === currentPlayerId));
  game.currentTurnPlayerId = players[(currentIndex + 1) % players.length].id;
}

function ensureCanGuess(game, player, socket, callback) {
  if (!game || !player) {
    sendError(socket, callback, "Không tìm thấy người chơi hoặc phòng chơi.", "PLAYER_NOT_FOUND");
    return false;
  }
  if (game.status !== "active") {
    sendError(socket, callback, "Phòng này đã kết thúc.", "GAME_FINISHED");
    return false;
  }
  if (game.mode === "turns" && game.currentTurnPlayerId && game.currentTurnPlayerId !== player.id) {
    sendError(socket, callback, "Chưa tới lượt của bạn.", "NOT_YOUR_TURN");
    return false;
  }
  if (game.mode === "free" && player.lastGuessAt) {
    const elapsed = Date.now() - new Date(player.lastGuessAt).getTime();
    if (elapsed < game.cooldownMs) {
      sendError(socket, callback, "Chờ một chút rồi đoán tiếp nhé.", "COOLDOWN");
      return false;
    }
  }
  return true;
}

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("game:create", (payload = {}, callback) => {
      const answer = normalizeText(payload.answer).trim();
      const hint = normalizeText(payload.hint).trim();
      const maxWrong = Number(payload.maxWrong || 7);
      const mode = normalizeMode(payload.mode);
      const illustrationTheme = normalizeIllustrationTheme(payload.illustrationTheme);

      if (!answer) {
        sendError(socket, callback, "Vui lòng nhập từ cần đoán.", "ANSWER_REQUIRED");
        return;
      }
      if (!Number.isFinite(maxWrong) || maxWrong < 1 || maxWrong > 12) {
        sendError(socket, callback, "Số lần sai tối đa phải từ 1 đến 12.", "MAX_WRONG_INVALID");
        return;
      }

      const answerCells = createAnswerCells(answer);
      if (answerCells.filter((cell) => cell.playable).length === 0) {
        sendError(socket, callback, "Từ cần đoán cần có ít nhất một chữ cái hoặc chữ số.", "ANSWER_INVALID");
        return;
      }

      const game = {
        id: makeId(),
        code: makeCode(),
        answer,
        answerCells,
        hint,
        mode,
        illustrationTheme,
        maxWrong: Math.floor(maxWrong),
        cooldownMs: 2200,
        hostToken: crypto.randomBytes(24).toString("hex"),
        status: "active",
        winnerId: null,
        currentTurnPlayerId: null,
        guesses: [],
        createdAt: now(),
        players: new Map()
      };

      saveGame(game);
      joinViewerRooms(socket, game, { role: "host" });

      const state = serializeGame(game, { role: "host" });
      const response = { ok: true, state, hostToken: game.hostToken };
      socket.emit("game:created", response);
      acknowledge(callback, response);
      emitGameList(io);
    });

    socket.on("games:list", (_payload = {}, callback) => {
      acknowledge(callback, { ok: true, rooms: listAvailableGames() });
    });

    socket.on("game:finish", (payload = {}, callback) => {
      const game = findGame(payload.code);
      if (!game || !canHost(game, payload.hostToken)) {
        sendError(socket, callback, "Bạn không có quyền kết thúc phòng này.", "HOST_TOKEN_INVALID");
        return;
      }
      game.status = "finished";
      emitAllStates(io, game);
      emitGameList(io);
      acknowledge(callback, { ok: true });
    });

    socket.on("game:get", (payload = {}, callback) => {
      const game = findGame(payload.code);
      if (!game) {
        sendError(socket, callback, "Không tìm thấy phòng chơi.", "GAME_NOT_FOUND");
        return;
      }

      if (payload.role === "host") {
        if (!canHost(game, payload.hostToken)) {
          sendError(socket, callback, "Mã chủ game không hợp lệ.", "HOST_TOKEN_INVALID");
          return;
        }
        joinViewerRooms(socket, game, { role: "host" });
        const state = serializeGame(game, { role: "host" });
        acknowledge(callback, { ok: true, state });
        socket.emit("game:state", state);
        return;
      }

      const player = game.players.get(String(payload.playerId || ""));
      if (!player) {
        sendError(socket, callback, "Không tìm thấy người chơi trong phòng này.", "PLAYER_NOT_FOUND");
        return;
      }
      joinViewerRooms(socket, game, { role: "player", playerId: player.id });
      const state = serializeGame(game, { role: "player", playerId: player.id });
      acknowledge(callback, { ok: true, state, playerId: player.id });
      socket.emit("game:state", state);
    });

    socket.on("game:join", (payload = {}, callback) => {
      const game = findGame(payload.code);
      const name = sanitizeName(payload.name);

      if (!game) {
        sendError(socket, callback, "Mã phòng không tồn tại.", "GAME_NOT_FOUND");
        return;
      }
      if (game.status !== "active") {
        sendError(socket, callback, "Phòng này đã kết thúc. Vui lòng chọn phòng khác.", "GAME_FINISHED");
        return;
      }
      if (!name) {
        sendError(socket, callback, "Vui lòng nhập tên hiển thị.", "NAME_REQUIRED");
        return;
      }

      const player = {
        id: makeId(),
        gameId: game.id,
        name,
        score: 0,
        status: "active",
        lastGuessAt: null,
        createdAt: now()
      };

      game.players.set(player.id, player);
      if (game.mode === "turns" && !game.currentTurnPlayerId) {
        game.currentTurnPlayerId = player.id;
      }
      joinViewerRooms(socket, game, { role: "player", playerId: player.id });

      const state = serializeGame(game, { role: "player", playerId: player.id });
      const response = { ok: true, state, playerId: player.id };
      socket.emit("game:state", state);
      socket.to(`host:${game.id}`).emit("player:joined", serializePlayer(player));
      acknowledge(callback, response);
      emitHostState(io, game);
      emitGameList(io);
    });

    socket.on("guess:letter", (payload = {}, callback) => {
      const game = findGame(payload.code);
      const player = game?.players.get(String(payload.playerId || ""));

      if (!ensureCanGuess(game, player, socket, callback)) return;

      const letter = normalizeGuessLetter(payload.letter);
      if (!letter.key) {
        sendError(socket, callback, "Vui lòng nhập một chữ cái hợp lệ.", "LETTER_REQUIRED");
        return;
      }

      const duplicate = game.guesses.some((guess) => guess.type === "letter" && guess.key === letter.key);
      const correct = isCorrectLetter(game.answerCells, letter.key);
      const guess = {
        id: makeId(),
        type: "letter",
        value: letter.value,
        key: letter.key,
        playerId: player.id,
        playerName: player.name,
        correct,
        duplicate,
        createdAt: now()
      };
      game.guesses.push(guess);
      player.lastGuessAt = guess.createdAt;
      if (!duplicate && correct) {
        player.score += 10;
      }
      if (isSolved(game.answerCells, game.guesses.filter((item) => item.type === "letter" && item.correct).map((item) => item.key))) {
        game.status = "won";
        game.winnerId = player.id;
        player.score += 30;
      } else if (wrongLetterCount(game) >= game.maxWrong) {
        game.status = "lost";
      }
      advanceTurn(game, player.id);

      emitAllStates(io, game);
      emitGameList(io);
      acknowledge(callback, { ok: true, state: serializeGame(game, { role: "player", playerId: player.id }) });
    });

    socket.on("guess:word", (payload = {}, callback) => {
      const game = findGame(payload.code);
      const player = game?.players.get(String(payload.playerId || ""));

      if (!ensureCanGuess(game, player, socket, callback)) return;

      const value = normalizeText(payload.word).trim();
      const correct = isFullAnswerCorrect(game.answer, value);
      const guess = {
        id: makeId(),
        type: "word",
        value,
        key: "",
        playerId: player.id,
        playerName: player.name,
        correct,
        duplicate: false,
        createdAt: now()
      };
      game.guesses.push(guess);
      player.lastGuessAt = guess.createdAt;
      if (correct) {
        game.status = "won";
        game.winnerId = player.id;
        player.score += 50;
      } else {
        player.score = Math.max(0, player.score - 2);
      }
      advanceTurn(game, player.id);

      emitAllStates(io, game);
      emitGameList(io);
      acknowledge(callback, { ok: true, state: serializeGame(game, { role: "player", playerId: player.id }) });
    });

    socket.on("player:leave", (payload = {}, callback) => {
      const game = findGame(payload.code);
      const player = game?.players.get(String(payload.playerId || ""));
      if (game && player) {
        player.status = "left";
        socket.leave(`player:${player.id}`);
        if (game.currentTurnPlayerId === player.id) advanceTurn(game, player.id);
        emitHostState(io, game);
      }
      acknowledge(callback, { ok: true });
    });
  });
}
