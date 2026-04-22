"use client";

import {
  createHookeModel,
  createSimulationEngine,
} from "@/utils/sumulators.utils";
import { useEffect, useRef, useState } from "react";
import HookeMultiGraph from "./HookeMultiGraph";
import HookeEnergy from "./HookeEnergy";
import HookeLabPanel from "./HookeLabPanel";

function drawSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  coils = 12,
  amplitude = 10,
) {
  const length = x2 - x1;
  const step = length / coils;

  ctx.beginPath();
  ctx.moveTo(x1, y);

  for (let i = 1; i < coils; i++) {
    const x = x1 + i * step;
    const offset = i % 2 === 0 ? -amplitude : amplitude;
    ctx.lineTo(x, y + offset);
  }

  ctx.lineTo(x2, y);
  ctx.stroke();
}

export default function HookeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);

  // 🎛 parámetros
  const [mass, setMass] = useState(1);
  const [k, setK] = useState(10);
  const [amplitude, setAmplitude] = useState(100);
  const [damping, setDamping] = useState(0.5);

  const [model] = useState(() =>
    createHookeModel({ mass, k, amplitude, damping }),
  );

  const [engine] = useState(() => createSimulationEngine(model));
  const [, setTick] = useState(0);

  /* 🔁 re-render loop */
  useEffect(() => {
    const unsub = engine.subscribe(() => {
      setTick((t) => t + 1);
    });

    return () => {
      unsub();
    };
  }, [engine]);

  /* 🔁 sync params */
  useEffect(() => {
    model.setParams({ mass, k, amplitude, damping });
  }, [mass, k, amplitude, damping]);

  /* 🎨 canvas render */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = model.getState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const baseY = canvas.height / 2;
    const x = centerX + state.position;

    // pared
    ctx.fillRect(centerX - 5, baseY - 40, 10, 80);

    // resorte
    drawSpring(ctx, centerX, x, baseY);

    // masa
    ctx.fillStyle = "#6366f1";
    ctx.fillRect(x - 15, baseY - 15, 30, 30);
  });

  /* 🖱 interacción */

  function getMouseX(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left;
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = getMouseX(e);
    const centerX = canvas.width / 2;

    const state = model.getState();
    const massX = centerX + state.position;

    if (Math.abs(x - massX) < 20) {
      isDragging.current = true;
      engine.pause();
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDragging.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = getMouseX(e);
    const centerX = canvas.width / 2;

    model.setState({
      position: x - centerX,
      velocity: 0,
      time: 0,
    });
  }

  function handleMouseUp() {
    if (!isDragging.current) return;

    isDragging.current = false;

    const state = model.getState();

    model.setParams({
      amplitude: Math.abs(state.position),
    });

    model.reset();
    engine.play();
  }

  /* 🎛 presets físicos */
  function handlePreset(type: string) {
    if (type === "ideal") setDamping(0);
    if (type === "medium") setDamping(1);
    if (type === "critical") setDamping(2 * Math.sqrt(k * mass));
    if (type === "heavy") setDamping(5);
  }

  const energy = model.getEnergy();
  const derived = model.getDerived();
  const state = model.getState();

  return (
    <div className="grid lg:grid-cols-4 gap-6">

      {/* 🧪 LAB PANEL */}
      <div className="lg:col-span-1 border rounded-xl p-4">
        <HookeLabPanel
          mass={mass}
          setMass={setMass}
          k={k}
          setK={setK}
          damping={damping}
          setDamping={setDamping}
          amplitude={amplitude}
          setAmplitude={setAmplitude}
          onPreset={handlePreset}
        />
      </div>

      {/* 🎨 CANVAS */}
      <canvas
        ref={canvasRef}
        width={600}
        height={220}
        className="w-full rounded-xl border cursor-pointer lg:col-span-3"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* 📈 MULTIGRÁFICA */}
      <div className="lg:col-span-4">
        <HookeMultiGraph model={model} engine={engine} />
      </div>

      {/* 🎮 CONTROLES */}
      <div className="flex gap-3 lg:col-span-4">
        <button onClick={engine.play} className="px-4 py-2 rounded bg-primary text-white">
          Play
        </button>
        <button onClick={engine.pause} className="px-4 py-2 rounded border">
          Pause
        </button>
        <button onClick={() => model.reset()} className="px-4 py-2 rounded border">
          Reset
        </button>
      </div>

      {/* ⚡ ENERGÍA */}
      <div className="lg:col-span-4">
        <HookeEnergy energy={energy} />
      </div>

      {/* 📊 DATA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm lg:col-span-4">
        <div>Posición: {state.position.toFixed(2)}</div>
        <div>Velocidad: {state.velocity.toFixed(2)}</div>
        <div>Energía total: {energy.total.toFixed(2)}</div>
        {"period" in derived && derived.period !== null && (
          <div>Periodo: {derived.period.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
}