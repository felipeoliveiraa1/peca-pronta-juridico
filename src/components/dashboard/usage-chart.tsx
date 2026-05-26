interface Props {
  daily: { date: string; count: number }[];
}

/** Mini chart de barras puramente em SVG — 30 dias de geração. */
export function UsageChart({ daily }: Props) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  const width = 100;
  const height = 32;
  const barW = width / daily.length;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-16 w-full">
      {daily.map((d, i) => {
        const h = (d.count / max) * (height - 2);
        return (
          <rect
            key={d.date}
            x={i * barW + barW * 0.15}
            y={height - h}
            width={barW * 0.7}
            height={h}
            rx={0.5}
            className={d.count > 0 ? "fill-brand-500" : "fill-ink-300"}
          />
        );
      })}
    </svg>
  );
}
