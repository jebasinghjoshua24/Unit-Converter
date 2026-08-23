"use client";

import { useEffect, useRef } from "react";

interface AnalogGaugeProps {
  /** Normalized needle target, 0..1 */
  normalized: number;
}

const START_ANGLE = Math.PI * 0.85;
const END_ANGLE = Math.PI * 2.15;

export default function AnalogGauge({ normalized }: AnalogGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleAngle = useRef(START_ANGLE);
  const targetAngle = useRef(START_ANGLE);
  const velocity = useRef(0);

  useEffect(() => {
    targetAngle.current = START_ANGLE + normalized * (END_ANGLE - START_ANGLE);
  }, [normalized]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctx2d;

    let raf = 0;

    function draw() {
      const spring = 0.08;
      const friction = 0.78;
      const force = (targetAngle.current - needleAngle.current) * spring;
      velocity.current += force;
      velocity.current *= friction;
      needleAngle.current += velocity.current;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height * 0.72;
      const radius = Math.min(width, height) * 0.55;

      ctx.clearRect(0, 0, width, height);

      // Gauge track
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, START_ANGLE, END_ANGLE);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#121722";
      ctx.stroke();

      // Active arc
      const norm = Math.max(0, Math.min(1, (needleAngle.current - START_ANGLE) / (END_ANGLE - START_ANGLE)));
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, START_ANGLE, START_ANGLE + (END_ANGLE - START_ANGLE) * norm);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#00f3ff";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ticks
      const totalTicks = 20;
      for (let i = 0; i <= totalTicks; i++) {
        const tickAngle = START_ANGLE + (i / totalTicks) * (END_ANGLE - START_ANGLE);
        const isMajor = i % 5 === 0;
        const tickLen = isMajor ? 13 : 7;
        const innerR = radius - 14;
        const outerR = innerR - tickLen;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(tickAngle) * innerR, centerY + Math.sin(tickAngle) * innerR);
        ctx.lineTo(centerX + Math.cos(tickAngle) * outerR, centerY + Math.sin(tickAngle) * outerR);
        ctx.lineWidth = isMajor ? 2.5 : 1;
        ctx.strokeStyle = isMajor ? (i > 15 ? "#ff3344" : "#00f3ff") : "#334155";
        ctx.stroke();

        if (isMajor) {
          const textR = outerR - 11;
          ctx.font = "10px 'Share Tech Mono', monospace";
          ctx.fillStyle = i > 15 ? "#ff3344" : "#64748b";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${i * 5}%`, centerX + Math.cos(tickAngle) * textR, centerY + Math.sin(tickAngle) * textR);
        }
      }

      // Needle
      const needleLen = radius - 16;
      const nx = centerX + Math.cos(needleAngle.current) * needleLen;
      const ny = centerY + Math.sin(needleAngle.current) * needleLen;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(nx, ny);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ffaa00";
      ctx.shadowColor = "#ffaa00";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pivot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#334155";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffaa00";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="h-52 w-full" aria-hidden="true" />;
}
