import { ClipboardCopy, Crown, Link as LinkIcon, RefreshCw, Settings, Trophy, Users } from "lucide-react";
import { type Socket } from "socket.io-client";
import { WrongGuessIllustration } from "../components/WrongGuessIllustration";
import { modeCopy } from "../constants";
import type { GameState, SocketResponse } from "../types";

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

export function HostDashboard({
  game,
  hostToken,
  socket,
  onError,
  onHome: _onHome,
  onCreateNewRoom
}: {
  game: GameState;
  hostToken: string;
  socket: Socket;
  onError: (message: string) => void;
  onHome: () => void;
  onCreateNewRoom: () => void;
}) {
  const players = [...(game.players || [])].sort((left, right) => right.score - left.score);
  const joinUrl = `${window.location.origin}?code=${game.code}`;
  const winner = players.find((player) => player.id === game.winnerId);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(joinUrl);
  };

  const finish = () => {
    socket.emit("game:finish", { code: game.code, hostToken }, (res: SocketResponse) => {
      if (!res.ok) onError(res.message || "Không thể kết thúc phòng.");
    });
  };

  return (
    <section className="dashboard host-dashboard">
      <div className="dashboard-banner">
        <div>
          <div className="eyebrow"><Crown size={18} /> Bảng chủ game</div>
          <h1>Phòng {game.code}</h1>
          <p>{game.hint || "Chưa có gợi ý."}</p>
        </div>
        <details className="settings-menu">
          <summary className="icon-button" aria-label="Cài đặt phòng">
            <Settings size={22} />
          </summary>
          <div className="settings-panel">
            <button className="settings-action" type="button" onClick={onCreateNewRoom}><Crown size={19} /> Tạo phòng mới</button>
            <button className="settings-action" type="button" onClick={copyLink}><ClipboardCopy size={19} /> Copy link</button>
            <button className="settings-action danger" type="button" onClick={finish}><Trophy size={19} /> Kết thúc</button>
          </div>
        </details>
      </div>

      <div className="info-strip">
        <div className="info-pill">
          <span><LinkIcon size={20} /></span>
          <div><small>Mã phòng</small><strong>{game.code}</strong></div>
        </div>
        <div className="info-pill">
          <span><RefreshCw size={20} /></span>
          <div><small>Chế độ</small><strong>{modeCopy[game.mode]}</strong></div>
        </div>
        <div className="info-pill">
          <span><Users size={20} /></span>
          <div><small>Người chơi</small><strong>{players.length}</strong></div>
        </div>
        <div className="info-pill">
          <span><Trophy size={20} /></span>
          <div><small>Đáp án</small><strong>{game.answer}</strong></div>
        </div>
      </div>

      <div className="play-grid">
        <div className="play-panel">
          <WordBoard game={game} />
          {game.status === "won" && <p className="result-note">{winner?.name || "Có người chơi"} đã giải được từ bí ẩn.</p>}
          {game.status === "lost" && <p className="result-note lost-note">Cả lớp đã hết số lần sai.</p>}
          <div className="guess-history">
            {game.guesses.slice().reverse().map((guess) => (
              <span className={guess.correct ? "correct" : guess.duplicate ? "duplicate" : "wrong"} key={guess.id}>
                {guess.playerName}: {guess.value}{guess.type === "word" ? " (đoán từ)" : ""}
              </span>
            ))}
          </div>
        </div>
        <WrongGuessIllustration theme={game.illustrationTheme} wrongCount={game.wrongCount} maxWrong={game.maxWrong} />
      </div>

      <div className="player-list compact-list">
        {players.length === 0 && <div className="empty-state"><Users size={42} /><strong>Đang chờ người chơi</strong><span>Chia sẻ mã phòng hoặc link để cả lớp tham gia.</span></div>}
        {players.map((player) => (
          <article className={`player-row ${game.currentTurnPlayerId === player.id ? "is-turn" : ""}`} key={player.id}>
            <strong>{player.name}</strong>
            <span>{game.currentTurnPlayerId === player.id ? "Đang tới lượt" : "Sẵn sàng"}</span>
            <b>{player.score} điểm</b>
          </article>
        ))}
      </div>
    </section>
  );
}
