import { illustrationThemeOptions } from "../constants";
import type { IllustrationTheme } from "../types";

function progress(wrongCount: number, maxWrong: number, steps: number) {
  return Math.ceil((wrongCount / Math.max(1, maxWrong)) * steps);
}

function themeTitle(theme: IllustrationTheme) {
  return illustrationThemeOptions.find((item) => item.id === theme)?.title || "Bong bóng bay";
}

export function WrongGuessIllustration({
  theme,
  wrongCount,
  maxWrong,
  compact = false
}: {
  theme: IllustrationTheme;
  wrongCount: number;
  maxWrong: number;
  compact?: boolean;
}) {
  const step = progress(wrongCount, maxWrong, 8);
  const left = Math.max(0, maxWrong - wrongCount);

  return (
    <div className={`wrong-illustration ${compact ? "compact-drawing" : ""}`} aria-label={`Sai ${wrongCount} trên ${maxWrong}`}>
      <svg className={`wrong-art wrong-art-${theme}`} viewBox="0 0 240 220" role="img">
        {theme === "balloons" && <Balloons step={step} />}
        {theme === "sandcastle" && <Sandcastle step={step} />}
        {theme === "rocket" && <Rocket step={step} />}
        {theme === "flower" && <Flower step={step} />}
        {theme === "candles" && <Candles step={step} />}
        {theme === "treasure" && <Treasure step={step} />}
        {theme === "robot" && <Robot step={step} />}
        {theme === "rainbow" && <Rainbow step={step} />}
      </svg>
      <div>
        <strong>{themeTitle(theme)}</strong>
        <span>Còn {left}/{maxWrong} lần sai</span>
      </div>
    </div>
  );
}

function Balloons({ step }: { step: number }) {
  const balloons = [
    [54, 72, "#ff6f7d"],
    [84, 48, "#61c9ff"],
    [118, 66, "#ffd76d"],
    [150, 44, "#2eb872"],
    [182, 78, "#c264ff"],
    [74, 116, "#ff9aa8"],
    [132, 112, "#7dd3fc"],
    [166, 118, "#facc15"]
  ];
  return (
    <>
      <rect x="35" y="184" width="170" height="12" rx="6" fill="#e8dcff" />
      {balloons.map(([x, y, color], index) => {
        const gone = index < step;
        return (
          <g key={index} opacity={gone ? 0.16 : 1} transform={gone ? `translate(0 ${20 + index * 3})` : undefined}>
            <line x1={x} y1={Number(y) + 26} x2="120" y2="184" stroke="#795f8f" strokeWidth="2" />
            <ellipse cx={x} cy={y} rx="18" ry="24" fill={String(color)} />
            <circle cx={Number(x) - 6} cy={Number(y) - 8} r="4" fill="rgba(255,255,255,.75)" />
          </g>
        );
      })}
    </>
  );
}

function Sandcastle({ step }: { step: number }) {
  return (
    <>
      <rect x="24" y="172" width="192" height="22" rx="11" fill="#f4d28f" />
      {[0, 1, 2].map((index) => (
        <g key={index} opacity={step > 5 + index ? 0.2 : 1}>
          <rect x={58 + index * 42} y={96 - index * 10} width="34" height={82 + index * 10} rx="7" fill="#d9a84f" />
          <path d={`M${58 + index * 42} 96 l8 -20 l9 20 l8 -20 l9 20`} fill="#f2c56b" />
        </g>
      ))}
      <rect x="84" y="128" width="72" height="50" rx="8" fill="#f2c56b" opacity={step > 4 ? 0.35 : 1} />
      <path d="M24 182 C62 158 91 202 124 178 C158 154 182 196 216 174 V220 H24 Z" fill="#61c9ff" opacity={0.18 + step * 0.08} />
      <path d="M18 198 C52 182 78 206 114 194 C150 182 178 208 222 190" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" opacity={0.28 + step * 0.08} />
    </>
  );
}

function Rocket({ step }: { step: number }) {
  return (
    <>
      <circle cx="188" cy="42" r="18" fill="#ffd76d" opacity=".75" />
      <path d="M120 36 C154 62 158 118 128 152 C96 118 88 64 120 36Z" fill="#61c9ff" opacity={step > 6 ? 0.25 : 1} />
      <path d="M120 36 C106 64 102 100 128 152 C158 118 154 62 120 36Z" fill="#c264ff" opacity={step > 6 ? 0.2 : 0.9} />
      <circle cx="124" cy="82" r="14" fill="#fff" opacity={step > 6 ? 0.25 : 1} />
      <path d="M101 132 L74 158 L106 154Z" fill="#ff6f7d" opacity={step > 5 ? 0.25 : 1} />
      <path d="M148 132 L176 158 L142 154Z" fill="#ff6f7d" opacity={step > 5 ? 0.25 : 1} />
      <path d="M108 158 C110 184 120 198 128 208 C138 194 148 182 146 158Z" fill="#ffd76d" opacity={Math.max(0.12, 1 - step * 0.1)} />
      <text x="33" y="52" fontSize="28" fontWeight="900" fill="#342145">{Math.max(0, 8 - step)}</text>
    </>
  );
}

function Flower({ step }: { step: number }) {
  const petals = [
    [120, 54],
    [154, 72],
    [154, 112],
    [120, 132],
    [86, 112],
    [86, 72],
    [100, 42],
    [140, 42]
  ];
  return (
    <>
      <line x1="120" y1="116" x2="120" y2="190" stroke="#2eb872" strokeWidth="10" strokeLinecap="round" />
      <path d="M120 164 C92 142 70 152 58 180 C88 188 106 184 120 164Z" fill="#72d39b" />
      <path d="M122 170 C154 146 178 156 190 184 C158 192 138 188 122 170Z" fill="#72d39b" />
      {petals.map(([x, y], index) => (
        <ellipse key={index} cx={x} cy={y} rx="18" ry="26" fill="#ff9aa8" opacity={index < step ? 0.14 : 1} />
      ))}
      <circle cx="120" cy="92" r="22" fill="#ffd76d" />
      <rect x="82" y="190" width="76" height="16" rx="8" fill="#d9a84f" />
    </>
  );
}

function Candles({ step }: { step: number }) {
  return (
    <>
      <rect x="42" y="158" width="156" height="36" rx="14" fill="#ffd76d" />
      <rect x="54" y="138" width="132" height="28" rx="12" fill="#ff9aa8" />
      {Array.from({ length: 8 }, (_, index) => {
        const x = 50 + index * 20;
        const off = index < step;
        return (
          <g key={index}>
            <rect x={x} y="92" width="10" height="48" rx="4" fill={index % 2 ? "#61c9ff" : "#c264ff"} />
            <path d={`M${x + 5} 78 C${x - 4} 90 ${x + 14} 90 ${x + 5} 78Z`} fill="#ffd76d" opacity={off ? 0.12 : 1} />
          </g>
        );
      })}
    </>
  );
}

function Treasure({ step }: { step: number }) {
  return (
    <>
      <path d="M58 106 Q120 50 182 106 V128 H58Z" fill="#d9a84f" />
      <rect x="54" y="108" width="132" height="74" rx="12" fill="#9a5c2e" />
      <rect x="70" y="122" width="100" height="16" rx="8" fill="#ffd76d" />
      {Array.from({ length: 8 }, (_, index) => {
        if (index >= step) return null;
        const x = 47 + (index % 4) * 38;
        const y = index < 4 ? 76 : 146;
        return (
          <g key={index}>
            <rect x={x} y={y + 14} width="24" height="22" rx="5" fill="#64748b" />
            <path d={`M${x + 5} ${y + 14} V${y + 7} Q${x + 12} ${y} ${x + 19} ${y + 7} V${y + 14}`} fill="none" stroke="#64748b" strokeWidth="5" />
          </g>
        );
      })}
      <circle cx="120" cy="144" r="13" fill="#ffd76d" />
    </>
  );
}

function Robot({ step }: { step: number }) {
  return (
    <>
      <rect x="74" y="66" width="92" height="92" rx="16" fill="#94a3b8" />
      <rect x="92" y="38" width="56" height="18" rx="9" fill="#64748b" />
      <line x1="120" y1="38" x2="120" y2="22" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="104" r="10" fill={step > 6 ? "#dbeafe" : "#61c9ff"} />
      <circle cx="140" cy="104" r="10" fill={step > 6 ? "#dbeafe" : "#61c9ff"} />
      <rect x="90" y="132" width="60" height="10" rx="5" fill="#342145" opacity={step > 7 ? 0.3 : 1} />
      <rect x="72" y="174" width="96" height="22" rx="11" fill="#e2e8f0" />
      {Array.from({ length: 8 }, (_, index) => (
        <rect key={index} x={82 + index * 10} y="180" width="7" height="10" rx="3" fill={index < 8 - step ? "#2eb872" : "#cbd5e1"} />
      ))}
    </>
  );
}

function Rainbow({ step }: { step: number }) {
  const colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#38bdf8", "#6366f1", "#a855f7", "#ec4899"];
  return (
    <>
      {colors.map((color, index) => (
        <path
          key={color}
          d={`M${32 + index * 10} 168 A${88 - index * 10} ${88 - index * 10} 0 0 1 ${208 - index * 10} 168`}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          opacity={index < colors.length - step ? 1 : 0.13}
        />
      ))}
      <ellipse cx="66" cy="172" rx="34" ry="18" fill="#fff" />
      <ellipse cx="176" cy="172" rx="34" ry="18" fill="#fff" />
    </>
  );
}
