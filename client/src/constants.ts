import type { IllustrationTheme, PlayerStatus, PunishmentDesign } from "./types";

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

export const illustrationThemeOptions: Array<{
  id: IllustrationTheme;
  title: string;
  description: string;
}> = [
  { id: "balloons", title: "Bong bóng bay", description: "Sai thì mất dần một quả bóng." },
  { id: "sandcastle", title: "Lâu đài cát", description: "Sai thì sóng xóa dần lâu đài." },
  { id: "rocket", title: "Tên lửa", description: "Sai thì đếm ngược tới lúc tên lửa bay." },
  { id: "flower", title: "Cây hoa", description: "Sai thì rụng dần cánh hoa." },
  { id: "candles", title: "Nến sinh nhật", description: "Sai thì tắt dần từng cây nến." },
  { id: "treasure", title: "Rương kho báu", description: "Sai thì rương thêm ổ khóa." },
  { id: "robot", title: "Robot hết pin", description: "Sai thì pin robot giảm dần." },
  { id: "rainbow", title: "Cầu vồng", description: "Sai thì mất dần dải màu." }
];

export const punishmentDesigns: PunishmentDesign[] = [
  { id: "classic", title: "Giá treo bí ẩn", action: "Mỗi lần sai thêm một nét vẽ.", badge: "_", theme: "classic" }
];
