import { Dice5, Play, Crown } from "lucide-react";
import { type FormEvent, useState } from "react";
import { WizardHeader } from "../components/WizardHeader";
import { wordBank } from "../data/wordBank";
import type { GameMode } from "../types";
import type { GameState, SocketResponse } from "../types";

export function CreateGameScreen({
  socket,
  onCreated,
  onBack,
  onError
}: {
  socket: { emit: (event: string, payload: unknown, callback: (response: SocketResponse) => void) => void };
  onCreated: (state: GameState, token: string) => void;
  onBack: () => void;
  onError: (message: string) => void;
}) {
  return (
    <section className="form-stage">
      <WizardHeader icon={<Crown size={34} />} title="Tạo phòng chơi" onBack={onBack} />
      <CreateGameForm socket={socket} onCreated={onCreated} onError={onError} />
    </section>
  );
}

function CreateGameForm({
  socket,
  onCreated,
  onError
}: {
  socket: { emit: (event: string, payload: unknown, callback: (response: SocketResponse) => void) => void };
  onCreated: (state: GameState, token: string) => void;
  onError: (message: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [maxWrong, setMaxWrong] = useState(7);
  const [mode, setMode] = useState<GameMode>("free");
  const [busy, setBusy] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    socket.emit("game:create", { answer, hint, maxWrong, mode }, (res: SocketResponse) => {
      setBusy(false);
      if (!res.ok || !res.state || !res.hostToken) {
        onError(res.message || "Không thể tạo phòng.");
        return;
      }
      onCreated(res.state, res.hostToken);
    });
  };

  const pickRandom = () => {
    const item = wordBank[Math.floor(Math.random() * wordBank.length)];
    setAnswer(item.answer);
    setHint(item.hint);
  };

  return (
    <form className="setup-form" onSubmit={submit}>
      <button className="soft-button" type="button" onClick={pickRandom}>
        <Dice5 size={20} />
        Chọn ngẫu nhiên từ kho 1000 từ
      </button>
      <label>
        <span>Từ/cụm bí ẩn</span>
        <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Ví dụ: CẦU VỒNG" autoFocus />
      </label>
      <label>
        <span>Gợi ý/mô tả</span>
        <textarea value={hint} onChange={(event) => setHint(event.target.value)} placeholder="Xuất hiện sau cơn mưa..." rows={4} />
      </label>
      <label>
        <span>Số lần đoán sai tối đa</span>
        <input type="number" min={1} max={12} value={maxWrong} onChange={(event) => setMaxWrong(Number(event.target.value))} />
      </label>
      <fieldset className="mode-choice">
        <legend>Chế độ chơi</legend>
        <label className="mode-option">
          <input type="radio" name="mode" checked={mode === "free"} onChange={() => setMode("free")} />
          <span>Cả lớp cùng đoán tự do</span>
        </label>
        <label className="mode-option">
          <input type="radio" name="mode" checked={mode === "turns"} onChange={() => setMode("turns")} />
          <span>Từng người một lượt</span>
        </label>
      </fieldset>
      <button className="primary-action" type="submit" disabled={busy}>
        <Play size={22} />
        {busy ? "Đang tạo..." : "Tạo phòng"}
      </button>
    </form>
  );
}
