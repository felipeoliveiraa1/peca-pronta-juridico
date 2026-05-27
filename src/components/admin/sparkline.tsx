interface SparklineProps {
  data: { date: string; count: number }[];
  color?: string;
  height?: number;
  label?: string;
}

export function Sparkline({
  data,
  color = "rgb(20 100 70)",
  height = 80,
  label,
}: SparklineProps) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      {label && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
          {label}
        </div>
      )}
      <div
        className="flex items-end gap-[2px] rounded-md bg-ink-100/40 p-2"
        style={{ height: height + 16 }}
      >
        {data.map((d) => {
          const h = (d.count / max) * height;
          return (
            <div
              key={d.date}
              className="group relative flex-1"
              style={{ height }}
              title={`${d.date}: ${d.count}`}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-sm transition group-hover:opacity-80"
                style={{
                  height: `${Math.max(2, h)}px`,
                  backgroundColor: color,
                  opacity: d.count > 0 ? 1 : 0.18,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink-500">
        <span>{data[0]?.date.slice(5)}</span>
        <span>hoje</span>
      </div>
    </div>
  );
}
