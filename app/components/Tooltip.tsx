"use client";

import { useState } from "react";

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block", marginLeft: "6px" }}>
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          width: "16px", height: "16px", borderRadius: "50%",
          background: "#e2e8f0", color: "#64748b",
          fontSize: "11px", fontWeight: 600,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", userSelect: "none",
        }}
      >
        ?
      </div>
      {visible && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#1e3a5f", color: "white",
          fontSize: "12px", lineHeight: 1.5,
          padding: "8px 12px", borderRadius: "8px",
          width: "220px", zIndex: 100,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          {text}
          <div style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #1e3a5f",
          }} />
        </div>
      )}
    </div>
  );
}