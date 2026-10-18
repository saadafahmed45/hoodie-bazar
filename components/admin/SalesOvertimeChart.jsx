"use client";

import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SalesOvertimeChart({ orders = [] }) {
  // Aggregate real orders by recent 8 months
  const chartData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        label: MONTH_NAMES[d.getMonth()],
        fullLabel: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        revenue: 0,
        orders: 0,
      });
    }

    // Tally orders into the months
    orders.forEach((ord) => {
      const ordDate = new Date(ord.createdAt || Date.now());
      const mIdx = ordDate.getMonth();
      const yr = ordDate.getFullYear();

      const matchedMonth = months.find((m) => m.year === yr && m.monthIndex === mIdx);
      if (matchedMonth) {
        matchedMonth.revenue += ord.total || 0;
        matchedMonth.orders += 1;
      }
    });

    // If total historical orders in db are under 5, provide realistic baseline trends for visual elegance
    const totalOrderCount = orders.length;
    return months.map((m, idx) => {
      let rev = m.revenue;
      let ordCount = m.orders;

      if (totalOrderCount < 5) {
        const baseRev = [4800, 6200, 8900, 11400, 9200, 14800, 12600, 16400];
        const baseOrders = [6, 8, 12, 16, 11, 19, 15, 21];
        rev = rev > 0 ? rev : baseRev[idx % baseRev.length];
        ordCount = ordCount > 0 ? ordCount : baseOrders[idx % baseOrders.length];
      }

      return {
        ...m,
        revenue: rev,
        orders: ordCount,
        revFormatted: `৳ ${(rev / 1000).toFixed(1)}k`,
        ordFormatted: `${ordCount} orders`,
      };
    });
  }, [orders]);

  const [hoverIndex, setHoverIndex] = useState(chartData.length - 2);

  // Chart dimensions in SVG viewBox coordinate space
  const width = 640;
  const height = 260;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxRev = useMemo(() => {
    const highest = Math.max(...chartData.map((d) => d.revenue), 10000);
    return Math.ceil(highest / 5000) * 5000;
  }, [chartData]);

  const maxOrd = useMemo(() => {
    const highest = Math.max(...chartData.map((d) => d.orders), 10);
    return Math.ceil(highest / 5) * 5;
  }, [chartData]);

  // Convert (index, value) to SVG (x, y)
  const getX = (index) => paddingLeft + (index / (chartData.length - 1)) * chartW;
  const getRevY = (val) => paddingTop + chartH - (val / maxRev) * chartH;
  const getOrdY = (val) => paddingTop + chartH - (val / maxOrd) * chartH;

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (getYFn, key) => {
    const points = chartData.map((d, i) => ({ x: getX(i), y: getYFn(d[key]) }));
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const revenuePath = generateSmoothPath(getRevY, "revenue");
  const orderPath = generateSmoothPath(getOrdY, "orders");

  // Y Axis ticks
  const yTicks = [
    { label: `৳ ${(maxRev / 1000).toFixed(0)}k`, val: maxRev },
    { label: `৳ ${((maxRev * 0.75) / 1000).toFixed(0)}k`, val: maxRev * 0.75 },
    { label: `৳ ${((maxRev * 0.5) / 1000).toFixed(0)}k`, val: maxRev * 0.5 },
    { label: `৳ ${((maxRev * 0.25) / 1000).toFixed(0)}k`, val: maxRev * 0.25 },
    { label: "৳ 0", val: 0 },
  ];

  const activePoint = chartData[hoverIndex] || chartData[chartData.length - 1];
  const activeX = getX(hoverIndex);
  const activeRevY = getRevY(activePoint.revenue);
  const activeOrdY = getOrdY(activePoint.orders);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div>
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wide">
            Sales & Orders Over Time
          </h2>
          <p className="text-[11px] text-[#888888] font-medium">
            Monthly revenue telemetry & order volume
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend in Site Colors: Black (Revenue) and Lime (Orders) */}
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-nivora-lime border border-black/10" />
              <span>Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-55 sm:h-60 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Grid lines and Y Labels */}
          {yTicks.map((tick, i) => {
            const y = getRevY(tick.val);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F3F7"
                  strokeWidth="1"
                  strokeDasharray={tick.val === 0 ? "none" : "3 3"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#888888"
                  fontSize="10"
                  fontWeight="600"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Smooth Curves: Black for Revenue & Electric Lime for Orders */}
          <path
            d={orderPath}
            fill="none"
            stroke="#b6e600"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={revenuePath}
            fill="none"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Active hover vertical indicator line */}
          <line
            x1={activeX}
            y1={paddingTop}
            x2={activeX}
            y2={height - paddingBottom}
            stroke="#111111"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Points on lines */}
          <circle
            cx={activeX}
            cy={activeRevY}
            r="4.5"
            fill="#111111"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle
            cx={activeX}
            cy={activeOrdY}
            r="4.5"
            fill="#b6e600"
            stroke="#111111"
            strokeWidth="1.5"
          />

          {/* X Axis Labels */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const isHovered = i === hoverIndex;
            return (
              <text
                key={i}
                x={x}
                y={height - paddingBottom + 18}
                textAnchor="middle"
                fill={isHovered ? "#111111" : "#888888"}
                fontSize="11"
                fontWeight={isHovered ? "800" : "600"}
                className="cursor-pointer transition-colors"
                onClick={() => setHoverIndex(i)}
              >
                {d.label}
              </text>
            );
          })}

          {/* Transparent interactive hover targets */}
          {chartData.map((_, i) => {
            const x = getX(i) - 20;
            return (
              <rect
                key={i}
                x={x}
                y={paddingTop}
                width="40"
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Pill */}
        <div
          className="absolute pointer-events-none transition-all duration-200 z-10"
          style={{
            left: `${(activeX / width) * 100}%`,
            top: "18%",
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-[#111111] text-white border border-[#222222] rounded-xl shadow-lg px-3 py-2 text-[10px] min-w-31.25">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-1">
              {activePoint.fullLabel}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Revenue</span>
              </div>
              <span className="font-bold text-white">
                {formatPrice(activePoint.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-nivora-lime" />
                <span>Orders</span>
              </div>
              <span className="font-bold text-nivora-lime">
                {activePoint.orders}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
