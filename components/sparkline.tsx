"use client";

import { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
}

export function Sparkline({ data, color }: SparklineProps) {
  const chartData = useMemo(() => data.map((value, index) => ({ index, value })), [data]);

  const stroke = color ?? (() => {
    const first = data[0];
    const last = data[data.length - 1];
    if (first === undefined || last === undefined) return '#6b7280';
    return last >= first ? '#22c55e' : '#ef4444';
  })();

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              borderRadius: '0.5rem',
              border: '1px solid hsl(var(--border))'
            }}
            labelFormatter={() => ''}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
