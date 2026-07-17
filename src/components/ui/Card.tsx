import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "glass" | "neon" | "flat";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "glass",
  hoverEffect = true,
  className = "",
  ...props
}) => {
  const baseStyle = "rounded-2xl p-6 transition-all duration-300 relative overflow-hidden";
  
  const variantStyles = {
    glass: "bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]",
    neon: "bg-slate-950 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    flat: "bg-slate-900 border border-slate-800 shadow-lg",
  };

  const hoverStyle = hoverEffect
    ? "hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] dark:hover:border-cyan-500/40"
    : "";

  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {/* Decorative Glow inside Card */}
      {variant === "glass" && (
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      {children}
    </div>
  );
};
