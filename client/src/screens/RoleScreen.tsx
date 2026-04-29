import { Crown, Star, Users } from "lucide-react";

export function RoleScreen({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  return (
    <section className="role-stage">
      <div className="hero-copy">
        <div className="eyebrow">
          <Star size={18} />
          Hangman phòng học realtime
        </div>
        <h1>Đoán hàng ngang trước khi hết số lần sai</h1>
      </div>
      <div className="role-grid">
        <button className="role-card host-card" type="button" onClick={onCreate}>
          <Crown size={42} />
          <strong>Chủ game</strong>
          <span>Tạo phòng, nhập đáp án hoặc chọn từ kho 1000 gợi ý.</span>
        </button>
        <button className="role-card player-card" type="button" onClick={onJoin}>
          <Users size={42} />
          <strong>Người chơi</strong>
          <span>Vào phòng, đoán chữ cái hoặc chốt cả cụm từ.</span>
        </button>
      </div>
    </section>
  );
}
