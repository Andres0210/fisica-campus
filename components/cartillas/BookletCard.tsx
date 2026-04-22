"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  item: any;
};

export default function BookletCard({ item }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(`booklet-${item.id}`);
    if (saved) setProgress(Number(saved));
  }, [item.id]);

  const percentage = item.pages
    ? Math.min(100, Math.round((progress / item.pages) * 100))
    : 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-background hover:shadow-xl transition">
      
      {/* COVER */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.cover || "/booklets/default.png"}
          alt={item.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <p className="text-xs text-muted-foreground">
          {item.subject}
        </p>

        <h3 className="mt-2 text-lg font-semibold">
          {item.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* STATUS */}
        <div className="mt-3 text-xs text-muted-foreground">
          {percentage === 0 && "No iniciado"}
          {percentage > 0 && percentage < 100 && `En progreso • ${percentage}%`}
          {percentage === 100 && "Completado"}
        </div>

        {/* ACTION */}
        <Link
          href={`/cartillas/watch/${item.id}`}
          className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
        >
          Leer online
        </Link>
      </div>
    </div>
  );
}