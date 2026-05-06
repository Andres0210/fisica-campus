"use client";

import {
  AlertTriangle,
  Gauge,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LoadType = "motor" | "lamp" | "outlet" | "transformer";
type LayerKey = "current" | "field" | "losses" | "labels";

type Junction = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type LoadPoint = {
  id: string;
  type: LoadType;
  label: string;
  x: number;
  y: number;
  countAsLoad?: boolean;
};

type Branch = {
  id: string;
  label: string;
  type: LoadType;
  loads: LoadPoint[];
  watts: number;
  current: number;
  lossWatts: number;
  capacity: number;
};

const servicePanel = { x: 8, y: 18 };

const junctions: Junction[] = [
  { id: "j1", label: "C1", x: 25, y: 29 },
  { id: "j2", label: "C2", x: 48, y: 42 },
  { id: "j3", label: "C3", x: 70, y: 30 },
  { id: "j4", label: "C4", x: 88, y: 41 },
];

const loads: LoadPoint[] = [
  { id: "m1", type: "motor", label: "M1", x: 25, y: 57 },
  { id: "m2", type: "motor", label: "M2", x: 58, y: 61 },
  { id: "m3", type: "motor", label: "M3", x: 88, y: 63 },
  { id: "l1", type: "lamp", label: "L1", x: 18, y: 78 },
  { id: "l2", type: "lamp", label: "L2", x: 48, y: 82 },
  { id: "l3", type: "lamp", label: "L3", x: 75, y: 74 },
  { id: "l4", type: "lamp", label: "L4", x: 88, y: 88 },
  { id: "o1", type: "outlet", label: "T1", x: 14, y: 43 },
  { id: "o2", type: "outlet", label: "T2", x: 34, y: 75 },
  { id: "o3", type: "outlet", label: "T3", x: 69, y: 56 },
  { id: "o4", type: "outlet", label: "T4", x: 80, y: 43 },
  { id: "tr1", type: "transformer", label: "TR", x: 76, y: 29, countAsLoad: false },
];

const loadStyle: Record<LoadType, { fill: string; stroke: string; text: string; line: string; name: string }> = {
  motor: { fill: "#15803d", stroke: "#14532d", text: "#ffffff", line: "#f97316", name: "Motores" },
  lamp: { fill: "#facc15", stroke: "#ca8a04", text: "#1f2937", line: "#eab308", name: "Iluminacion" },
  outlet: { fill: "#2563eb", stroke: "#1e40af", text: "#ffffff", line: "#ef4444", name: "Tomas" },
  transformer: { fill: "#9333ea", stroke: "#6b21a8", text: "#ffffff", line: "#9333ea", name: "Transformacion" },
};

const layerOptions: Array<{ key: LayerKey; label: string }> = [
  { key: "current", label: "Corriente" },
  { key: "field", label: "Campo B" },
  { key: "losses", label: "Perdidas" },
  { key: "labels", label: "Etiquetas" },
];

const monthlyLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function nearestJunction(load: LoadPoint) {
  return junctions.reduce((best, item) => {
    const bestDistance = Math.hypot(load.x - best.x, load.y - best.y);
    const itemDistance = Math.hypot(load.x - item.x, load.y - item.y);
    return itemDistance < bestDistance ? item : best;
  }, junctions[0]);
}

function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function percent(value: number) {
  return `${formatNumber(value * 100, 0)}%`;
}

function statusFromLoadRatio(ratio: number) {
  if (ratio >= 1) return { label: "Critico", className: "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-200" };
  if (ratio >= 0.8) return { label: "Alto", className: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-200" };
  return { label: "Normal", className: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" };
}

function buildPath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function MetricTile({ label, value, detail, tone = "default" }: { label: string; value: string; detail: string; tone?: "default" | "warn" | "good" }) {
  const toneClass =
    tone === "warn"
      ? "border-amber-500/50 bg-amber-500/10"
      : tone === "good"
        ? "border-emerald-500/50 bg-emerald-500/10"
        : "border-border bg-card";

  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClass}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold leading-none">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function RangeControl({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatNumber(value, step < 1 ? 2 : 0)} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}

function ElectricPlan({
  branches,
  phase,
  layers,
  totalCurrent,
}: {
  branches: Branch[];
  phase: number;
  layers: Record<LayerKey, boolean>;
  totalCurrent: number;
}) {
  const branchByType = useMemo(() => {
    return branches.reduce<Record<LoadType, Branch | undefined>>((acc, branch) => {
      acc[branch.type] = branch;
      return acc;
    }, {} as Record<LoadType, Branch | undefined>);
  }, [branches]);

  const particles = useMemo(() => {
    return loads
      .filter((load) => load.type !== "transformer")
      .flatMap((load, loadIndex) => {
        const start = nearestJunction(load);
        const branch = branchByType[load.type];
        const particleCount = clamp(Math.round((branch?.current ?? 3) / 12), 1, 5);

        return Array.from({ length: particleCount }, (_, offset) => {
          const progress = (phase * (0.45 + (branch?.current ?? 20) / 180) + offset / particleCount + loadIndex * 0.071) % 1;
          return {
            id: `${load.id}-${offset}`,
            color: loadStyle[load.type].line,
            x: start.x + (load.x - start.x) * progress,
            y: start.y + (load.y - start.y) * progress,
            r: 0.35 + Math.min((branch?.current ?? 10) / 120, 0.65),
          };
        });
      });
  }, [branchByType, phase]);

  const fieldVectors = useMemo(() => {
    const vectors = [];
    const strength = clamp(totalCurrent / 120, 0.25, 1.25);

    for (let x = 16; x <= 92; x += 12) {
      for (let y = 24; y <= 86; y += 12) {
        const angle = phase * Math.PI * 2 + x * 0.09 - y * 0.065;
        vectors.push({
          id: `${x}-${y}`,
          x,
          y,
          dx: Math.cos(angle) * 1.65 * strength,
          dy: Math.sin(angle) * 1.65 * strength,
        });
      }
    }

    return vectors;
  }, [phase, totalCurrent]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="font-semibold">Plano electrico operativo</h3>
          <p className="text-xs text-muted-foreground">Distribucion radial con lectura de corriente, ramales y perdidas</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {branches.map((branch) => {
            const status = statusFromLoadRatio(branch.current / branch.capacity);
            return (
              <span key={branch.id} className={`rounded-md border px-2 py-1 ${status.className}`}>
                {branch.label}: {formatNumber(branch.current, 1)} A
              </span>
            );
          })}
        </div>
      </div>

      <svg viewBox="0 0 100 100" className="min-h-[430px] w-full bg-[#f8fafc] text-slate-900">
        <defs>
          <pattern id="professional-grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#dbe4ee" strokeWidth="0.35" />
          </pattern>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
          <marker id="flow-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#0f172a" opacity="0.55" />
          </marker>
        </defs>

        <rect width="100" height="100" fill="url(#professional-grid)" />
        <rect x="3" y="6" width="94" height="88" rx="1.2" fill="none" stroke="#94a3b8" strokeWidth="0.35" />

        {layers.losses &&
          loads
            .filter((load) => load.type !== "transformer")
            .map((load) => {
              const branch = branchByType[load.type];
              const radius = 2 + clamp((branch?.lossWatts ?? 0) / 150, 0, 4);
              return (
                <circle
                  key={`loss-${load.id}`}
                  cx={load.x}
                  cy={load.y}
                  r={radius}
                  fill="#ef4444"
                  opacity="0.1"
                />
              );
            })}

        <path
          d={buildPath([servicePanel, junctions[0], junctions[1], junctions[2], junctions[3]])}
          fill="none"
          stroke="#1d4ed8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.65"
        />

        {layers.current && (
          <path
            d={buildPath([servicePanel, junctions[0], junctions[1], junctions[2], junctions[3]])}
            fill="none"
            stroke="#0f172a"
            strokeDasharray="2 4"
            strokeLinecap="round"
            strokeWidth="0.45"
            markerEnd="url(#flow-arrow)"
            opacity="0.55"
          />
        )}

        <g filter="url(#soft-shadow)">
          <rect x="5" y="13" width="10" height="10" rx="1.2" fill="#111827" />
          <text x="10" y="17.4" textAnchor="middle" fontSize="2.1" fontWeight="700" fill="#ffffff">
            Tablero
          </text>
          <text x="10" y="20.1" textAnchor="middle" fontSize="1.55" fill="#cbd5e1">
            2P
          </text>
        </g>

        {junctions.map((junction) => (
          <g key={junction.id} filter="url(#soft-shadow)">
            <circle cx={junction.x} cy={junction.y} r="2.45" fill="#475569" />
            <text x={junction.x} y={junction.y + 0.7} textAnchor="middle" fontSize="1.95" fontWeight="700" fill="#ffffff">
              {junction.label}
            </text>
          </g>
        ))}

        {loads.map((load) => {
          const start = nearestJunction(load);
          const style = loadStyle[load.type];
          const branch = branchByType[load.type];
          const width = 0.65 + clamp((branch?.current ?? 6) / 60, 0, 1.1);

          return (
            <g key={load.id}>
              <line
                x1={start.x}
                y1={start.y}
                x2={load.x}
                y2={load.y}
                stroke={style.line}
                strokeWidth={width}
                strokeLinecap="round"
                strokeDasharray={load.type === "transformer" ? "0" : "1.3 1.2"}
                opacity="0.95"
              />

              <g filter="url(#soft-shadow)">
                {load.type === "outlet" ? (
                  <rect x={load.x - 2.45} y={load.y - 2.45} width="4.9" height="4.9" rx="0.65" fill={style.fill} stroke={style.stroke} strokeWidth="0.45" />
                ) : load.type === "transformer" ? (
                  <polygon
                    points={`${load.x},${load.y - 3.4} ${load.x + 3.7},${load.y - 1.4} ${load.x + 3.7},${load.y + 1.9} ${load.x},${load.y + 3.8} ${load.x - 3.7},${load.y + 1.9} ${load.x - 3.7},${load.y - 1.4}`}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth="0.45"
                  />
                ) : (
                  <circle cx={load.x} cy={load.y} r={load.type === "lamp" ? 3.05 : 3.65} fill={style.fill} stroke={style.stroke} strokeWidth="0.45" />
                )}
                <text x={load.x} y={load.y + 0.72} textAnchor="middle" fontSize="2.1" fontWeight="800" fill={style.text}>
                  {load.label}
                </text>
              </g>

              {layers.labels && load.type !== "transformer" && (
                <text x={load.x + 4.8} y={load.y - 2.6} fontSize="2.05" fill="#334155">
                  {formatNumber((branch?.watts ?? 0) / Math.max(branch?.loads.length ?? 1, 1), 0)} W
                </text>
              )}
            </g>
          );
        })}

        {layers.current &&
          particles.map((particle) => (
            <circle key={particle.id} cx={particle.x} cy={particle.y} r={particle.r} fill={particle.color} opacity="0.95" />
          ))}

        {layers.field &&
          fieldVectors.map((vector) => (
            <line
              key={vector.id}
              x1={vector.x - vector.dx}
              y1={vector.y - vector.dy}
              x2={vector.x + vector.dx}
              y2={vector.y + vector.dy}
              stroke="#0891b2"
              strokeWidth="0.38"
              strokeLinecap="round"
              opacity="0.72"
            />
          ))}

        <g transform="translate(5 88)">
          <rect x="0" y="-8" width="42" height="9.8" rx="1" fill="#ffffff" stroke="#cbd5e1" />
          <circle cx="3" cy="-4.8" r="1.1" fill="#f97316" />
          <text x="5.2" y="-4" fontSize="2.1" fill="#334155">motor</text>
          <circle cx="15" cy="-4.8" r="1.1" fill="#eab308" />
          <text x="17.2" y="-4" fontSize="2.1" fill="#334155">luz</text>
          <circle cx="25" cy="-4.8" r="1.1" fill="#ef4444" />
          <text x="27.2" y="-4" fontSize="2.1" fill="#334155">toma</text>
        </g>
      </svg>
    </div>
  );
}

function LoadBalance({ branches }: { branches: Branch[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Balance por ramal</h3>
      </div>

      <div className="space-y-4">
        {branches.map((branch) => {
          const ratio = branch.current / branch.capacity;
          const status = statusFromLoadRatio(ratio);
          return (
            <div key={branch.id}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span>{branch.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatNumber(branch.current, 1)} A / {branch.capacity} A
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${clamp(ratio * 100, 0, 100)}%`,
                    background: ratio >= 1 ? "#dc2626" : ratio >= 0.8 ? "#d97706" : loadStyle[branch.type].line,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{branch.loads.length} puntos</span>
                <span className={status.className.split(" ").slice(-1).join(" ")}>{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeLossChart({ samples }: { samples: number[] }) {
  const visible = samples.slice(-48);
  const max = Math.max(...visible, 1);
  const points = visible
    .map((value, index) => {
      const x = 8 + index * (86 / Math.max(visible.length - 1, 1));
      const y = 78 - (value / max) * 54;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 90" className="h-64 w-full rounded-lg border border-border bg-card">
      {[0, 1, 2, 3].map((line) => (
        <line key={line} x1="8" y1={24 + line * 18} x2="96" y2={24 + line * 18} stroke="currentColor" opacity="0.1" />
      ))}
      <line x1="8" y1="78" x2="96" y2="78" stroke="currentColor" opacity="0.2" />
      <line x1="8" y1="18" x2="8" y2="78" stroke="currentColor" opacity="0.2" />
      <polyline points={points} fill="none" stroke="#dc2626" strokeWidth="1.6" />
      {visible.slice(-8).map((value, index) => {
        const absoluteIndex = visible.length - 8 + index;
        if (absoluteIndex < 0) return null;
        const x = 8 + absoluteIndex * (86 / Math.max(visible.length - 1, 1));
        const y = 78 - (value / max) * 54;
        return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.15" fill="#dc2626" />;
      })}
      <text x="9" y="11" fontSize="4" fontWeight="700" fill="currentColor">
        Perdidas instantaneas
      </text>
      <text x="9" y="86" fontSize="3.2" fill="currentColor" opacity="0.62">
        potencia disipada por minuto
      </text>
      <text x="75" y="16" fontSize="3.2" fill="currentColor" opacity="0.72">
        max {formatNumber(max, 0)} W
      </text>
    </svg>
  );
}

function MonthlyEnergyChart({ monthlyKwh }: { monthlyKwh: number[] }) {
  const max = Math.max(...monthlyKwh, 1);
  const min = Math.min(...monthlyKwh);
  const points = monthlyKwh
    .map((value, index) => {
      const x = 8 + index * (86 / 11);
      const y = 78 - (value / max) * 54;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 90" className="h-64 w-full rounded-lg border border-border bg-card">
      <line x1="8" y1="78" x2="96" y2="78" stroke="currentColor" opacity="0.2" />
      <line x1="8" y1="18" x2="8" y2="78" stroke="currentColor" opacity="0.2" />
      {monthlyKwh.map((value, index) => {
        const height = (value / max) * 52;
        return (
          <g key={monthlyLabels[index]}>
            <rect x={5.8 + index * 7.35} y={78 - height} width="4.4" height={height} rx="0.7" fill="#bae6fd" />
            <text x={8 + index * 7.35} y="85.5" textAnchor="middle" fontSize="2.75" fill="currentColor" opacity="0.68">
              {monthlyLabels[index]}
            </text>
          </g>
        );
      })}
      <polyline points={points} fill="none" stroke="#e11d48" strokeWidth="1.5" />
      {points.split(" ").map((point, index) => {
        const [x, y] = point.split(",");
        return <circle key={index} cx={x} cy={y} r="1.25" fill="#e11d48" />;
      })}
      <text x="9" y="11" fontSize="4" fontWeight="700" fill="currentColor">
        Energia perdida mensual
      </text>
      <text x="64" y="16" fontSize="3.2" fill="currentColor" opacity="0.72">
        {formatNumber(min, 1)} - {formatNumber(max, 1)} kWh
      </text>
    </svg>
  );
}

function RecommendationPanel({
  totalCurrent,
  efficiency,
  criticalBranches,
  monthlyLossKwh,
  monthlyCost,
}: {
  totalCurrent: number;
  efficiency: number;
  criticalBranches: Branch[];
  monthlyLossKwh: number;
  monthlyCost: number;
}) {
  const mainAdvice =
    criticalBranches.length > 0
      ? "Hay ramales por encima del margen recomendado. Conviene redistribuir cargas o separar circuitos antes de operar continuo."
      : efficiency < 0.97
        ? "La instalacion opera sin sobrecarga, pero las perdidas ya son visibles. Mejor calibre y menor longitud bajarian el costo mensual."
        : "La instalacion se mantiene en una zona eficiente para el escenario actual.";

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Diagnostico tecnico</h3>
      </div>
      <p className="text-sm text-muted-foreground">{mainAdvice}</p>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="rounded-md border border-border p-3">
          <p className="font-medium">Proteccion principal</p>
          <p className="mt-1 text-muted-foreground">
            La corriente total estimada es {formatNumber(totalCurrent, 1)} A. Para servicio continuo se recomienda no
            superar el 80% del interruptor nominal.
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="font-medium">Impacto economico</p>
          <p className="mt-1 text-muted-foreground">
            Las perdidas equivalen a {formatNumber(monthlyLossKwh, 1)} kWh/mes, cerca de ${formatNumber(monthlyCost, 0)} COP.
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="font-medium">Acciones recomendadas</p>
          <p className="mt-1 text-muted-foreground">
            Emparejar fase y retorno, revisar empalmes, balancear motores y tomas, y validar caida de tension en los tramos largos.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ElectricCircuitScene() {
  const [voltage, setVoltage] = useState(110);
  const [motorPower, setMotorPower] = useState(2250);
  const [lampPower, setLampPower] = useState(240);
  const [outletPower, setOutletPower] = useState(9000);
  const [lossPower, setLossPower] = useState(150);
  const [energyRate, setEnergyRate] = useState(950);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState(0);
  const [samples, setSamples] = useState<number[]>([150, 153, 156, 151]);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    current: true,
    field: true,
    losses: true,
    labels: true,
  });

  const branches = useMemo<Branch[]>(() => {
    const motorLoads = loads.filter((load) => load.type === "motor");
    const lampLoads = loads.filter((load) => load.type === "lamp");
    const outletLoads = loads.filter((load) => load.type === "outlet");
    const transformerLoads = loads.filter((load) => load.type === "transformer");

    const branchInput = [
      { id: "motors", label: "Motores", type: "motor" as const, loads: motorLoads, watts: motorPower, lossShare: 0.34, capacity: 40 },
      { id: "lighting", label: "Iluminacion", type: "lamp" as const, loads: lampLoads, watts: lampPower, lossShare: 0.14, capacity: 20 },
      { id: "outlets", label: "Tomas", type: "outlet" as const, loads: outletLoads, watts: outletPower, lossShare: 0.44, capacity: 60 },
      { id: "transformer", label: "Transformador", type: "transformer" as const, loads: transformerLoads, watts: 0, lossShare: 0.08, capacity: 20 },
    ];

    return branchInput.map((branch) => ({
      ...branch,
      current: branch.watts / voltage,
      lossWatts: lossPower * branch.lossShare,
    }));
  }, [lampPower, lossPower, motorPower, outletPower, voltage]);

  const totals = useMemo(() => {
    const usefulPower = motorPower + lampPower + outletPower;
    const totalPower = usefulPower + lossPower;
    const totalCurrent = totalPower / voltage;
    const lossRatio = lossPower / Math.max(totalPower, 1);
    const efficiency = usefulPower / Math.max(totalPower, 1);
    const monthlyLossKwh = (lossPower * 24 * 30) / 1000;
    const monthlyCost = monthlyLossKwh * energyRate;
    const recommendedOutletPower = voltage * 15 * 0.8;

    return {
      usefulPower,
      totalPower,
      totalCurrent,
      lossRatio,
      efficiency,
      monthlyLossKwh,
      monthlyCost,
      recommendedOutletPower,
    };
  }, [energyRate, lampPower, lossPower, motorPower, outletPower, voltage]);

  const monthlySeries = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const seasonal = 1 + Math.sin(index * 0.55 + 0.3) * 0.085;
      const operation = 1 + (index % 4 === 0 ? 0.035 : 0);
      return totals.monthlyLossKwh * seasonal * operation;
    });
  }, [totals.monthlyLossKwh]);

  const criticalBranches = useMemo(() => {
    return branches.filter((branch) => branch.current / branch.capacity >= 0.8);
  }, [branches]);

  useEffect(() => {
    if (!isPlaying) return;

    let frame = 0;
    let raf = 0;

    const tick = () => {
      frame += 1;
      setPhase((value) => (value + 0.0075) % 1);

      if (frame % 38 === 0) {
        setSamples((current) => {
          const next =
            lossPower *
            (1 + Math.sin(current.length * 0.34) * 0.075 + Math.sin(current.length * 0.11) * 0.035);
          return [...current, Math.max(0, next)].slice(-96);
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, lossPower]);

  function reset() {
    setVoltage(110);
    setMotorPower(2250);
    setLampPower(240);
    setOutletPower(9000);
    setLossPower(150);
    setEnergyRate(950);
    setPhase(0);
    setSamples([150, 153, 156, 151]);
    setIsPlaying(true);
    setLayers({ current: true, field: true, losses: true, labels: true });
  }

  function toggleLayer(key: LayerKey) {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  }

  const efficiencyTone = totals.efficiency >= 0.98 ? "good" : totals.efficiency >= 0.95 ? "default" : "warn";
  const currentTone = criticalBranches.length > 0 ? "warn" : "good";

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow">simulador de circuitos</p>
            <h2 className="mt-1 text-2xl font-semibold">Instalacion electrica con perdidas y campo magnetico</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Modelo visual para analizar potencia instalada, corriente por ramal, disipacion por efecto Joule y costo energetico.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              title="Reproducir"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border"
              title="Pausar"
            >
              <Pause className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border"
              title="Restablecer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Potencia total" value={`${formatNumber(totals.totalPower, 0)} W`} detail={`${formatNumber(totals.usefulPower, 0)} W utiles`} />
        <MetricTile label="Corriente total" value={`${formatNumber(totals.totalCurrent, 1)} A`} detail="estimada en el tablero" tone={currentTone} />
        <MetricTile label="Eficiencia" value={percent(totals.efficiency)} detail={`${percent(totals.lossRatio)} convertido en calor`} tone={efficiencyTone} />
        <MetricTile label="Costo perdido" value={`$${formatNumber(totals.monthlyCost, 0)}`} detail={`${formatNumber(totals.monthlyLossKwh, 1)} kWh por mes`} tone={totals.monthlyCost > 120000 ? "warn" : "default"} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <aside className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Parametros de operacion</h3>
            </div>

            <div className="space-y-4">
              <RangeControl label="Voltaje de servicio" value={voltage} unit="V" min={90} max={240} step={1} onChange={setVoltage} />
              <RangeControl label="Carga de motores" value={motorPower} unit="W" min={0} max={8000} step={50} onChange={setMotorPower} />
              <RangeControl label="Iluminacion" value={lampPower} unit="W" min={0} max={2500} step={20} onChange={setLampPower} />
              <RangeControl label="Tomas generales" value={outletPower} unit="W" min={0} max={14000} step={100} onChange={setOutletPower} />
              <RangeControl label="Perdidas estimadas" value={lossPower} unit="W" min={0} max={1200} step={10} onChange={setLossPower} />
              <RangeControl label="Tarifa energia" value={energyRate} unit="COP/kWh" min={300} max={1600} step={10} onChange={setEnergyRate} />
            </div>
          </aside>

          <aside className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Capas del plano</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {layerOptions.map((layer) => (
                <button
                  key={layer.key}
                  type="button"
                  onClick={() => toggleLayer(layer.key)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    layers[layer.key] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </aside>

          <LoadBalance branches={branches} />
        </div>

        <ElectricPlan branches={branches} phase={phase} layers={layers} totalCurrent={totals.totalCurrent} />
      </section>

      {criticalBranches.length > 0 && (
        <section className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Revisa {criticalBranches.map((branch) => branch.label).join(", ")}: opera por encima del margen del 80%.
              Reduce carga, aumenta capacidad del ramal o redistribuye puntos.
            </p>
          </div>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
        <TimeLossChart samples={samples} />
        <MonthlyEnergyChart monthlyKwh={monthlySeries} />
        <RecommendationPanel
          totalCurrent={totals.totalCurrent}
          efficiency={totals.efficiency}
          criticalBranches={criticalBranches}
          monthlyLossKwh={totals.monthlyLossKwh}
          monthlyCost={totals.monthlyCost}
        />
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <Zap className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Criterio fisico del modelo</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              La corriente se calcula con I = P / V para cargas equivalentes. La energia perdida mensual se estima como
              Pperdida por horas de operacion, y el mapa de campo magnetico representa cualitativamente el aumento de B
              con la corriente total. Para una memoria tecnica real se debe complementar con calibre, longitud, material
              del conductor, temperatura y factor de potencia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
