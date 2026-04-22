"use client";

import { createSimulationEngine } from "@/utils/sumulators.utils";
import { createWaveModel } from "@/utils/wavel/createWaveModel";
import { useEffect, useRef, useState } from "react";

export default function WaveScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);

  // 🎛 parámetros
  const [tension, setTension] = useState(50);
  const [density, setDensity] = useState(1);
  const [damping, setDamping] = useState(0.002);

  // 🎛 fuente
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(40);
  const [sourceOn, setSourceOn] = useState(true);

  const points = 120;

  const [model] = useState(() =>
    createWaveModel({
      points,
      tension,
      density,
      damping,
    }),
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
    model.setParams({ tension, density, damping });
  }, [tension, density, damping]);

  /* 🎯 fuente oscilante */
  useEffect(() => {
    let unsub: any;
    if (sourceOn) {
      let time = 0;
      unsub = engine.subscribe(() => {
        time += 0.016;

        const state = model.getState();
        const i = 5;

        state.y[i] = amplitude * Math.sin(2 * Math.PI * frequency * time);
      });
    }
    return () => { if (unsub) unsub(); };
  }, [engine, sourceOn, frequency, amplitude, model]);

  /* 🎨 render */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { y } = model.getState();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mid = canvas.height / 2;
    const step = canvas.width / (y.length - 1);

    ctx.beginPath();

    for (let i = 0; i < y.length; i++) {
      const x = i * step;
      const py = mid + y[i];

      if (i === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }

    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  /* 🖱 interacción */

  function getMousePos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDragging.current = true;
    engine.pause();
    handleMouseMove(e);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDragging.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getMousePos(e);

    const state = model.getState();

    const index = Math.floor((x / canvas.width) * state.y.length);
    const center = canvas.height / 2;

    if (index >= 0 && index < state.y.length) {
      state.y[index] = y - center;
      state.v[index] = 0;
    }
  }

  function handleMouseUp() {
    if (!isDragging.current) return;

    isDragging.current = false;
    engine.play();
  }

  /* 🎛 data */
  const speed = Math.sqrt(tension / density);

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* PANEL */}
      <div className="lg:col-span-1 border rounded-xl p-4 space-y-4">
        <h3 className="font-semibold">Parámetros</h3>

        <div>
          <label>Tensión: {tension}</label>
          <input
            type="range"
            min="10"
            max="200"
            value={tension}
            onChange={(e) => setTension(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Densidad: {density}</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Damping: {damping.toFixed(4)}</label>
          <input
            type="range"
            min="0"
            max="0.01"
            step="0.0005"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <h3 className="font-semibold pt-2">Fuente</h3>

        <div>
          <label>Frecuencia: {frequency}</label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Amplitud: {amplitude}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={() => setSourceOn((v) => !v)}
          className="w-full mt-2 px-4 py-2 rounded bg-primary text-white"
        >
          {sourceOn ? "Apagar fuente" : "Encender fuente"}
        </button>
      </div>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="lg:col-span-3 w-full border rounded-xl cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* CONTROLES */}
      <div className="flex gap-3 lg:col-span-4">
        <button
          onClick={engine.play}
          className="px-4 py-2 rounded bg-primary text-white"
        >
          Play
        </button>
        <button onClick={engine.pause} className="px-4 py-2 rounded border">
          Pause
        </button>
        <button
          onClick={() => model.reset()}
          className="px-4 py-2 rounded border"
        >
          Reset
        </button>
      </div>

      {/* DATA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm lg:col-span-4">
        <div>Velocidad onda: {speed.toFixed(2)}</div>
        <div>Frecuencia: {frequency.toFixed(2)}</div>
        <div>Amplitud: {amplitude}</div>
        <div>Damping: {damping.toFixed(4)}</div>
      </div>
    </div>
  );
}
