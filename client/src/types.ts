export type GameMode = "free" | "turns";
export type IllustrationTheme = "balloons" | "sandcastle" | "rocket" | "flower" | "candles" | "treasure" | "robot" | "rainbow";
export type GameStatus = "active" | "won" | "lost" | "finished";
export type PlayerStatus = "active" | "left";
export type Screen = "role" | "create" | "join" | "host" | "player";
export type Review = "correct" | "wrong" | "pending";
export type Filter = "all" | "pending" | "won" | "lost";

export type AnswerCell = {
  index: number;
  playable: boolean;
  value: string | null;
};

export type Guess = {
  id: string;
  type: "letter" | "word";
  value: string;
  key: string;
  playerId: string;
  playerName: string;
  correct: boolean;
  duplicate: boolean;
  createdAt: string;
  gameId?: string;
  letters: string[];
  review: Review[];
  autoReview?: Review[];
  status: "pending" | "reviewed";
  reviewedAt?: string | null;
};

export type Player = {
  id: string;
  gameId: string;
  name: string;
  score: number;
  status: PlayerStatus;
  lastGuessAt: string | null;
  createdAt: string;
  attemptsUsed?: number;
  attemptsLeft?: number;
  maxAttempts?: number;
  lockedLetters?: Array<string | null>;
  guesses: Guess[];
};

export type PunishmentState = {
  id: string;
  revealedParts: number;
  totalParts: number;
};

export type PunishmentDesign = {
  id: string;
  title: string;
  action: string;
  badge: string;
  theme: string;
};

export type GameSummary = {
  code: string;
  hint: string;
  mode: GameMode;
  illustrationTheme: IllustrationTheme;
  wrongLeft: number;
  maxWrong: number;
  playableCount: number;
  playerCount: number;
  status: GameStatus;
  createdAt: string;
};

export type GameState = {
  id: string;
  code: string;
  answer?: string;
  answerCells: AnswerCell[];
  revealedLetters: Array<string | null>;
  hint: string;
  mode: GameMode;
  illustrationTheme: IllustrationTheme;
  maxWrong: number;
  wrongCount: number;
  wrongLeft: number;
  playableCount: number;
  uniqueLetterCount: number;
  guesses: Guess[];
  status: GameStatus;
  winnerId: string | null;
  currentTurnPlayerId: string | null;
  cooldownMs: number;
  maxAttempts?: number;
  punishment?: PunishmentState;
  createdAt: string;
  viewer: {
    role: "host" | "player";
    playerId: string | null;
  };
  players?: Player[];
  player?: Player | null;
};

export type SocketResponse = {
  ok: boolean;
  message?: string;
  state?: GameState;
  hostToken?: string;
  playerId?: string;
  rooms?: GameSummary[];
};
