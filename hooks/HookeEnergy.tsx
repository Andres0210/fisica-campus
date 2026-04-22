"use client";

type Props = {
  energy: {
    kinetic: number;
    potential: number;
    total: number;
  };
};

export default function HookeEnergy({ energy }: Props) {
  const max = Math.max(energy.total, 1); // evita división por 0

  const kPct = (energy.kinetic / max) * 100;
  const pPct = (energy.potential / max) * 100;
  const tPct = 100; // siempre llena

  return (
    <div className="space-y-4">

      {/* BARRAS */}
      <div className="space-y-3">

        {/* CINÉTICA */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Cinética</span>
            <span>{energy.kinetic.toFixed(2)}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded">
            <div
              className="h-3 bg-blue-500 rounded transition-all"
              style={{ width: `${kPct}%` }}
            />
          </div>
        </div>

        {/* POTENCIAL */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Potencial</span>
            <span>{energy.potential.toFixed(2)}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded">
            <div
              className="h-3 bg-purple-500 rounded transition-all"
              style={{ width: `${pPct}%` }}
            />
          </div>
        </div>

        {/* TOTAL */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Total</span>
            <span>{energy.total.toFixed(2)}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded">
            <div
              className="h-3 bg-gray-400 rounded transition-all"
              style={{ width: `${tPct}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}