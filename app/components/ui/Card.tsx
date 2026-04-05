import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  shadow?: boolean;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  padding = "md",
  border = true,
  shadow = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl",
        border ? "border border-slate-100" : "",
        shadow ? "shadow-sm" : "",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
