"use client";

type Props = {
  mass: number;
  setMass: (v: number) => void;
  k: number;
  setK: (v: number) => void;
  damping: number;
  setDamping: (v: number) => void;
  amplitude: number;
  setAmplitude: (v: number) => void;
  onPreset: (type: string) => void;
};

export default function HookeLabPanel({
  mass,
  setMass,
  k,
  setK,
  damping,
  setDamping,
  amplitude,
  setAmplitude,
  onPreset,
}: Props) {
  return (
    <div className="space-y-6">

      {/* PRESETS */}
      <div>
        <h3 className="font-semibold mb-2">Experimentos</h3>

        <div className="flex flex-col gap-2">
          <button onClick={() => onPreset("ideal")} className="border px-3 py-2 rounded">
            Sin fricción
          </button>
          <button onClick={() => onPreset("medium")} className="border px-3 py-2 rounded">
            Amortiguado
          </button>
          <button onClick={() => onPreset("critical")} className="border px-3 py-2 rounded">
            Crítico
          </button>
          <button onClick={() => onPreset("heavy")} className="border px-3 py-2 rounded">
            Sobreamortiguado
          </button>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="space-y-4">

        <div>
          <label>Masa: {mass}</label>
          <input type="range" min="0.5" max="5" step="0.1"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Constante k: {k}</label>
          <input type="range" min="1" max="50"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Damping: {damping.toFixed(2)}</label>
          <input type="range" min="0" max="5" step="0.1"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label>Amplitud: {amplitude}</label>
          <input type="range" min="20" max="200"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}