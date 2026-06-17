import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GlassCard = ({ children }: Props) => {
  return (
    <div
      className="
      backdrop-blur-xl
      bg-white/5
      border
      border-white/10
      rounded-3xl
      shadow-2xl
      p-6
      "
    >
      {children}
    </div>
  );
};

export default GlassCard;
