"use client";

import { useEffect, useRef } from "react";

type Props = {
  model: any;
  engine: any;
};

export default function HookeMultiGraph({ model, engine }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dataRef = useRef<{
    position: number[];
    velocity: number[];
    acceleration: number[];
  }>({
    position: [],
    velocity: [],
    acceleration: [],
  });

  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      const state = model.getState();

      dataRef.current.position.push(state.position);
      dataRef.current.velocity.push(state.velocity);
      dataRef.current.acceleration.push(state.acceleration);

      // limitar tamaño
      if (dataRef.current.position.length > 300) {
        dataRef.current.position.shift();
        dataRef.current.velocity.shift();
        dataRef.current.acceleration.shift();
      }

      draw();
    });

    return () => unsubscribe();
  }, [engine]);

  function drawLine(
    ctx: CanvasRenderingContext2D,
    data: number[],
    color: string,
    scaleY: number,
    midY: number
  ) {
    ctx.beginPath();

    data.forEach((value, i) => {
      const x = i * 2;
      const y = midY - value * scaleY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { position, velocity, acceleration } = dataRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;

    // escalas (ajústalas si quieres)
    const posScale = 0.5;
    const velScale = 0.1;
    const accScale = 0.02;

    drawLine(ctx, position, "#6366f1", posScale, midY); // azul
    drawLine(ctx, velocity, "#22c55e", velScale, midY); // verde
    drawLine(ctx, acceleration, "#ef4444", accScale, midY); // rojo

    // eje horizontal
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.strokeStyle = "#888";
    ctx.stroke();
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={600}
        height={220}
        className="w-full rounded-xl border"
      />

      {/* LEYENDA */}
      <div className="flex gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-indigo-500 inline-block" /> Posición
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 inline-block" /> Velocidad
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 inline-block" /> Aceleración
        </span>
      </div>
    </div>
  );
}