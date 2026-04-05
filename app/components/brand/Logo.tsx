import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

const sizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export default function Logo({
  href = "/",
  size = "md",
  variant = "dark",
}: LogoProps) {
  const textSize = sizeMap[size];
  const rankColor = variant === "light" ? "text-white" : "text-brand";
  const myColor = variant === "light" ? "text-white/60" : "text-slate-400";
  const bizColor = variant === "light" ? "text-white" : "text-brand";

  const content = (
    <span className={`inline-flex items-center gap-1.5 font-bold tracking-tight ${textSize}`}>
      {/* Spark icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={variant === "light" ? "text-white/80" : "text-brand"}
        aria-hidden="true"
      >
        <path
          d="M10 2L12.5 8H18L13.5 11.5L15.5 18L10 14L4.5 18L6.5 11.5L2 8H7.5L10 2Z"
          fill="currentColor"
        />
      </svg>
      <span className={rankColor}>Rank</span>
      <span className={myColor}>My</span>
      <span className={bizColor}>Biz</span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
