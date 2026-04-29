import { Clock3, Home, Send, Sparkles, Trophy, Users } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { type Socket } from "socket.io-client";
import { Confetti } from "../components/Confetti";
import { modeCopy } from "../constants";
import { isPlayableInput, segmentText, upperLetter } from "../utils/wordGuessing";
import type { GameState, Player, SocketResponse } from "../types";

function WordBoard({ game }: { game: GameState }) {
  return (
    <div className="hangman-word" aria-label="Từ bí ẩn">
      {game.answerCells.map((cell, index) =>
        cell.playable ? (
          <span className="word-slot" key={cell.index}>{game.revealedLetters[index] || "_"}</span>
        ) : (
          <span className="word-separator" key={cell.index}>{cell.value === " " ? " " : cell.value}</span>
        )
      )}
    </div>
  );
}

function HangmanDrawing({ wrongCount, maxWrong }: { wrongCount: number; maxWrong: number }) {
  const visible = Math.ceil((wrongCount / Math.max(1, maxWrong)) * 9);
  return (
    <div className="hangman-card compact-drawing">
      <svg viewBox="0 0 220 220" role="img">
        <line className="show" x1="35" y1="198" x2="185" y2="198" />
        <line className={visible > 0 ? "show" : ""} x1="62" y1="198" x2="62" y2="28" />
        <line className={visible > 1 ? "show" : ""} x1="62" y1="28" x2="152" y2="28" />
        <line className={visible > 2 ? "show" : ""} x1="152" y1="28" x2="152" y2="58" />
        <circle className={visible > 3 ? "show" : ""} cx="152" cy="77" r="19" />
        <line className={visible > 4 ? "show" : ""} x1="152" y1="96" x2="152" y2="142" />
        <line className={visible > 5 ? "show" : ""} x1="152" y1="112" x2="124" y2="130" />
        <line className={visible > 6 ? "show" : ""} x1="152" y1="112" x2="180" y2="130" />
        <line className={visible > 7 ? "show" : ""} x1="152" y1="142" x2="128" y2="172" />
        <line className={visible > 8 ? "show" : ""} x1="152" y1="142" x2="176" y2="172" />
      </svg>
      <strong>Còn {maxWrong - wrongCount} lần sai</strong>
    </div>
  );
}

export function PlayerGameScreen({
  game,
  player,
  playerId,
  socket,
  onError,
  onHome,
  onJoinNewRoom
}: {
  game: GameState;
  player: Player;
  playerId: string;
  socket: Socket;
  onError: (message: string) => void;
  onHome: () => void;
  onJoinNewRoom: () => void;
}) {
  const [letter, setLetter] = useState("");
  const [word, setWord] = useState("");
  const [burst, setBurst] = useState(false);
  const isMyTurn = game.mode === "free" || !game.currentTurnPlayerId || game.currentTurnPlayerId === playerId;
  const canGuess = game.status === "active" && isMyTurn;
  const players = [...(game.players || [])].sort((left, right) => right.score - left.score);
  const guessedKeys = useMemo(() => new Set(game.guesses.filter((guess) => guess.type === "letter").map((guess) => guess.key)), [game.guesses]);

  useEffect(() => {
    if (game.status === "won") {
      setBurst(true);
      const id = window.setTimeout(() => setBurst(false), 2600);
      return () => window.clearTimeout(id);
    }
  }, [game.status]);

  const submitLetter = (event: FormEvent) => {
    event.preventDefault();
    const next = upperLetter(segmentText(letter).find(isPlayableInput) || "");
    if (!next) return;
    socket.emit("guess:letter", { code: game.code, playerId, letter: next }, (res: SocketResponse) => {
      if (!res.ok) onError(res.message || "Không thể gửi chữ cái.");
      else setLetter("");
    });
  };

  const submitWord = (event: FormEvent) => {
    event.preventDefault();
    if (!word.trim()) return;
    socket.emit("guess:word", { code: game.code, playerId, word }, (res: SocketResponse) => {
      if (!res.ok) onError(res.message || "Không thể gửi đáp án.");
      else setWord("");
    });
  };

  return (
    <section className="dashboard player-dashboard">
      {burst && <Confetti />}
      <div className="dashboard-banner player-banner">
        <div>
          <div className="eyebrow"><Sparkles size={18} /> Phòng {game.code}</div>
          <h1>{game.status === "won" ? "Đã giải được rồi!" : game.status === "lost" ? "Hết lượt sai" : "Hàng ngang bí ẩn"}</h1>
          <p>{game.hint || "Chủ game chưa nhập gợi ý."}</p>
        </div>
        <div className="host-actions">
          <button className="primary-action compact" type="button" onClick={onJoinNewRoom}><Users size={20} /> Phòng mới</button>
          <button className="soft-button" type="button" onClick={onHome}><Home size={20} /> Trang chính</button>
        </div>
      </div>

      <div className="play-grid">
        <div className="play-panel">
          <div className="play-stats">
            <div className="info-pill">
              <span><Clock3 size={18} /></span>
              <div><small>Chế độ</small><strong>{modeCopy[game.mode]}</strong></div>
            </div>
            <div className="info-pill">
              <span><Trophy size={18} /></span>
              <div><small>Điểm của bạn</small><strong>{player.score}</strong></div>
            </div>
          </div>
          <WordBoard game={game} />
          {!isMyTurn && <p className="waiting-note">Đang chờ lượt của bạn.</p>}
          {game.answer && game.status !== "active" && <p className="result-note">Đáp án: {game.answer}</p>}

          <form className="guess-form" onSubmit={submitLetter}>
            <input value={letter} onChange={(event) => setLetter(upperLetter(segmentText(event.target.value).find(isPlayableInput) || ""))} placeholder="Nhập 1 chữ" disabled={!canGuess} />
            <button className="primary-action compact" type="submit" disabled={!canGuess || !letter || guessedKeys.has(letter)}><Send size={20} /> Đoán chữ</button>
          </form>

          <form className="guess-form" onSubmit={submitWord}>
            <input value={word} onChange={(event) => setWord(event.target.value)} placeholder="Đoán cả từ/cụm" disabled={!canGuess} />
            <button className="soft-button" type="submit" disabled={!canGuess || !word.trim()}>Đoán đáp án</button>
          </form>

          <div className="guess-history">
            {game.guesses.slice().reverse().map((guess) => (
              <span className={guess.correct ? "correct" : guess.duplicate ? "duplicate" : "wrong"} key={guess.id}>{guess.playerName}: {guess.value}</span>
            ))}
          </div>
        </div>
        <div className="side-stack">
          <HangmanDrawing wrongCount={game.wrongCount} maxWrong={game.maxWrong} />
          <div className="leaderboard">
            {players.map((item, index) => <div className="player-row" key={item.id}><strong>{index + 1}. {item.name}</strong><b>{item.score}</b></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
