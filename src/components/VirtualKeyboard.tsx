"use client";

import { useState } from "react";

export type KeyboardField = "name" | "phone" | "text";

type Lang = "ru" | "en";

type Props = {
  field: KeyboardField;
  labels: {
    space: string;
    save: string;
    lang: string;
  };
  onInput: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSave: () => void;
  onClose: () => void;
};

type ActionId =
  | "bksp"
  | "tab"
  | "enter"
  | "shift"
  | "space"
  | "lang"
  | "save"
  | "close";

type KeyDef =
  | { type: "char"; lower: string; upper: string }
  | {
      type: "action";
      id: ActionId;
      label: string;
      wide?: "sm" | "md" | "lg";
    };

const EN_ROWS: string[][] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "{bksp}"],
  ["{tab}", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "{enter}"],
  ["{shift}", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "{shift}"],
  ["{lang}", "{space}", "{save}", "{close}"],
];

const EN_SHIFT: Record<string, string> = {
  "`": "~",
  "1": "!",
  "2": "@",
  "3": "#",
  "4": "$",
  "5": "%",
  "6": "^",
  "7": "&",
  "8": "*",
  "9": "(",
  "0": ")",
  "-": "_",
  "=": "+",
  "[": "{",
  "]": "}",
  "\\": "|",
  ";": ":",
  "'": '"',
  ",": "<",
  ".": ">",
  "/": "?",
};

const RU_ROWS: string[][] = [
  ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "{bksp}"],
  ["{tab}", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\"],
  ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "{enter}"],
  ["{shift}", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "{shift}"],
  ["{lang}", "{space}", "{save}", "{close}"],
];

const RU_SHIFT: Record<string, string> = {
  ё: "Ё",
  "1": "!",
  "2": '"',
  "3": "№",
  "4": ";",
  "5": "%",
  "6": ":",
  "7": "?",
  "8": "*",
  "9": "(",
  "0": ")",
  "-": "_",
  "=": "+",
  "\\": "/",
  ".": ",",
};

function resolveKey(
  token: string,
  lang: Lang,
  shifted: boolean,
  labels: Props["labels"],
): KeyDef {
  if (token === "{bksp}")
    return { type: "action", id: "bksp", label: "←", wide: "sm" };
  if (token === "{tab}")
    return { type: "action", id: "tab", label: "Tab", wide: "sm" };
  if (token === "{enter}")
    return { type: "action", id: "enter", label: "Enter", wide: "md" };
  if (token === "{shift}")
    return { type: "action", id: "shift", label: "Shift", wide: "md" };
  if (token === "{space}")
    return { type: "action", id: "space", label: labels.space, wide: "lg" };
  if (token === "{lang}")
    return { type: "action", id: "lang", label: labels.lang, wide: "sm" };
  if (token === "{save}")
    return { type: "action", id: "save", label: labels.save, wide: "md" };
  if (token === "{close}")
    return { type: "action", id: "close", label: "✕", wide: "sm" };

  const map = lang === "ru" ? RU_SHIFT : EN_SHIFT;
  const upper =
    map[token] ??
    (lang === "ru" ? token.toLocaleUpperCase("ru-RU") : token.toUpperCase());

  return {
    type: "char",
    lower: token,
    upper: shifted ? upper : token,
  };
}

function KeyButton({
  children,
  wide,
  active,
  accent,
  onPress,
}: {
  children: React.ReactNode;
  wide?: "sm" | "md" | "lg";
  active?: boolean;
  accent?: boolean;
  onPress: () => void;
}) {
  const flex =
    wide === "lg"
      ? "flex-[4]"
      : wide === "md"
        ? "flex-[1.6]"
        : wide === "sm"
          ? "flex-[1.3]"
          : "flex-1";

  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
      onClick={onPress}
      className={`inline-flex min-h-13 items-center justify-center rounded-xl border px-1 text-base font-bold shadow-sm transition active:scale-[0.96] sm:min-h-14 sm:text-lg ${flex} ${
        accent
          ? "border-[var(--primary)]/30 bg-[var(--primary)] text-white"
          : active
            ? "border-[var(--primary)]/40 bg-[var(--primary-light)] text-[var(--fg)]"
            : "border-[var(--border)] bg-white text-[var(--fg)] hover:bg-[var(--primary-light)]"
      }`}
    >
      {children}
    </button>
  );
}

export function VirtualKeyboard({
  field,
  labels,
  onInput,
  onBackspace,
  onEnter,
  onSave,
  onClose,
}: Props) {
  const [lang, setLang] = useState<Lang>("ru");
  const [shifted, setShifted] = useState(false);
  const rows = lang === "ru" ? RU_ROWS : EN_ROWS;

  function pressChar(display: string) {
    if (field === "phone" && !/\d/.test(display)) return;
    onInput(display);
    if (shifted) setShifted(false);
  }

  function handleAction(id: ActionId) {
    switch (id) {
      case "bksp":
        onBackspace();
        break;
      case "tab":
        onEnter();
        break;
      case "enter":
        onEnter();
        break;
      case "shift":
        setShifted((v) => !v);
        break;
      case "space":
        if (field !== "phone") onInput(" ");
        break;
      case "lang":
        setLang((v) => (v === "ru" ? "en" : "ru"));
        setShifted(false);
        break;
      case "save":
        onSave();
        break;
      case "close":
        onClose();
        break;
    }
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[#e8eef3]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_40px_rgba(12,26,46,0.14)] backdrop-blur-md animate-fade-up"
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1.5">
        {rows.map((row, i) => (
          <div key={`${lang}-${i}`} className="flex gap-1.5">
            {row.map((token, keyIndex) => {
              const key = resolveKey(token, lang, shifted, labels);
              if (key.type === "char") {
                return (
                  <KeyButton
                    key={`${lang}-${i}-${keyIndex}`}
                    onPress={() => pressChar(key.upper)}
                  >
                    {key.upper}
                  </KeyButton>
                );
              }
              return (
                <KeyButton
                  key={`${lang}-${i}-${keyIndex}-${key.id}`}
                  wide={key.wide}
                  active={key.id === "shift" && shifted}
                  accent={key.id === "save"}
                  onPress={() => handleAction(key.id)}
                >
                  {key.label}
                </KeyButton>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
