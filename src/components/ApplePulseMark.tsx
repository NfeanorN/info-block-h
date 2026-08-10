"use client";

type Props = {
  size?: number;
  className?: string;
  variant?: "screen" | "print";
};

export function ApplePulseMark({
  size = 64,
  className = "",
  variant = "screen",
}: Props) {
  const src =
    variant === "print" ? "/brand/logo-apple-print.png" : "/brand/logo-apple.png";

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
      draggable={false}
    />
  );
}
