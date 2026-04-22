"use client";

import { useEffect, useRef } from "react";

type Props = {
  model: any;
  engine: any;
};

export default function HookeGraph({ model, engine }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dataRef = useRef<number[]>([]);

  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      const state = model.getState();

      dataRef.current.push(state.position);

      // limitar tamaño (scroll)
      if (dataRef.current.length > 300) {
        dataRef.current.shift();
      }

      draw();
    });

    return () => unsubscribe();
  }, [engine]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = dataRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;
    const scaleY = 0.5;

    ctx.beginPath();

    data.forEach((value, i) => {
      const x = i * 2;
      const y = midY - value * scaleY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = "#6366f1";
    ctx.stroke();

    // línea base
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.strokeStyle = "#888";
    ctx.stroke();
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="w-full rounded-xl border"
    />
  );
}