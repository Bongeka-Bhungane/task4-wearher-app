import React from "react";

type props = {
  variant: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};
const Text: React.FC<props> = ({ variant, children, style, className }) => {
  if (variant === "h1") return <h1 style={style}>{children}</h1>;
  if (variant === "h2") return <h2 style={style} className={className}>{children}</h2>;
  if (variant === "p") return <p style={style}>{children}</p>;
  if (variant === "a") return <a style={style}>{children}</a>;
    return (
    <div style={style}>{children}</div>
);
};

export default Text;
