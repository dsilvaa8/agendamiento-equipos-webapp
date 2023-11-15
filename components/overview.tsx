"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview({ data, title }: any) {
  return (
    <div className="flex flex-col w-full gap-2">
      <h1 className="text-center">{title}</h1>
      <ResponsiveContainer
        width="100%"
        height={600}
        className="border border-grey-500 rounded"
      >
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="total" fill="#E74C3C" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
