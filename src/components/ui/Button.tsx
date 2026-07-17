import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "neon-cyan" | "neon-pink" | "outline" | "ghost";
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "neon-cyan",
  glow = true,
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 transform active:scale-95 cursor-pointer text-sm font-semibold select-none flex items-center justify-center gap-2";

  const variantStyles = {
    "neon-cyan":
      "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]",
    "neon-pink":
      "bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)] hover:bg-pink-500 hover:shadow-[0_0_25px_rgba(219,39,119,0.8)]",
    outline:
      "border border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800 hover:border-slate-500",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5 bg-transparent",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
