import type { PlayerStatus, PunishmentDesign } from "./types";

export const HOST_SESSION = "hangman-classroom-host";
export const PLAYER_SESSION = "hangman-classroom-player";
export const PLAYER_NAME = "hangman-classroom-player-name";

export const statusCopy: Record<PlayerStatus, string> = {
  active: "Đang chơi",
  left: "Đã rời phòng"
};

export const modeCopy = {
  free: "Cả lớp cùng đoán",
  turns: "Từng người một lượt"
} as const;

export const punishmentDesigns: PunishmentDesign[] = [
  { id: "classic", title: "Giá treo bí ẩn", action: "Mỗi lần sai thêm một nét vẽ.", badge: "_", theme: "classic" }
];
