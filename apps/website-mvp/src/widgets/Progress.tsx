import React from "react";

type ProgressProps = {
  completed: number;
  total: number;
};

export const Progress: React.FC<ProgressProps> = ({ completed, total }) => {
  const safeTotal = total <= 0 ? 1 : total;
  const value = Math.min(100, Math.round((completed / safeTotal) * 100));
  return (
    <div style={{ width: "100%", background: "#f3f4f6", borderRadius: 12, padding: 4 }}>
      <div
        style={{
          width: `${value}%`,
          transition: "width 0.3s ease",
          background: "linear-gradient(90deg,#ff6d6d,#ff9a9a)",
          borderRadius: 8,
          height: 12,
        }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
      <span style={{ display: "block", marginTop: 8, fontSize: 12, color: "#4b5563" }}>{value}% готово</span>
    </div>
  );
};
