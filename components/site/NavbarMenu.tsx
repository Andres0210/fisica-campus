"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavGroup = {
  label: string;
  href?: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

type NavbarMenuProps = {
  items: NavGroup[];
  onNavigate?: () => void;
  mobile?: boolean;
};

export default function NavbarMenu({ items, onNavigate, mobile = false }: NavbarMenuProps) {
  const pathname = usePathname();
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  if (mobile) {
    return (
      <div className="space-y-3">
        {items.map((item) =>
          item.children ? (
            <div key={item.label} className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <div className="mt-3 space-y-2">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href ?? "/"}
              onClick={onNavigate}
              className="block rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      {items.map((item) => {
        const isActive =
          item.href === pathname || item.children?.some((child) => pathname.startsWith(child.href));

        if (!item.children) {
          return (
            <Link
              key={item.label}
              href={item.href ?? "/"}
              className={`text-sm font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        }

        const isOpen = openLabel === item.label;

        return (
          <div
            key={item.label}
            className="relative py-3"
            onMouseEnter={() => setOpenLabel(item.label)}
            onMouseLeave={() => setOpenLabel(null)}
          >
            <button
              type="button"
              onClick={() => setOpenLabel(isOpen ? null : item.label)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 w-72 rounded-[1.5rem] border border-border/70 bg-card/95 p-3 shadow-2xl backdrop-blur-xl">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpenLabel(null)}
                    className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
