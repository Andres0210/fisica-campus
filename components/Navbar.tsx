"use client";

import { Atom, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Simuladores",
    children: [
      { label: "Todos los simuladores", href: "/simuladores" },
      { label: "Fisica II", href: "/simuladores/fisica-2" },
      { label: "Fisica III", href: "/simuladores/fisica-3" },
    ],
  },
  {
    label: "Reels Fisica",
    children: [
      { label: "Todos los videos", href: "/videos" },
      { label: "Reels Fisica II", href: "/videos/fisica-2" },
      { label: "Reels Fisica III", href: "/videos/fisica-3" },
    ],
  },
  {
    label: "Documentos",
    children: [
      { label: "Todos los documentos", href: "/documentos" },
      { label: "Documentos Fisica II", href: "/documentos/fisica-2" },
      { label: "Documentos Fisica III", href: "/documentos/fisica-3" },
    ],
  },
  {
    label: "Libros o Cartillas",
    children: [
      { label: "Todas las cartillas", href: "/cartillas" },
      { label: "Cartillas Fisica II", href: "/cartillas/fisica-2" },
      { label: "Cartillas Fisica III", href: "/cartillas/fisica-3" },
    ],
  },
  { label: "Autores", href: "/autores" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const pathname = usePathname();

  // ocultar navbar al bajar
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header
      className={`
        sticky top-0 z-50 px-4 pt-4 md:px-6
        transition-transform duration-300
        ${visible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="section-shell flex items-center justify-between rounded-full px-5 py-3 bg-background/80 backdrop-blur-md border border-border/60">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <Atom className="h-5 w-5" />
          </span>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground">FisicaLab</p>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
              Recursos y simulaciones
            </p>
          </div>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ))}

          <ThemeToggle />
        </div>

        {/* MOBILE */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-full border border-border/80 p-2"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="section-shell mt-3 rounded-[1.5rem] border border-border shadow-xl bg-background px-5 py-5 md:hidden"
          >
            {navItems.map((item) => (
              <div key={item.label} className="mb-3">
                {item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <p className="font-medium">{item.label}</p>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ========================= */
/* NAV LINK COMPONENT */
/* ========================= */

type NavLinkProps = {
  item: NavItem;
  pathname: string;
};

function NavLink({ item, pathname }: NavLinkProps) {
  const [open, setOpen] = useState(false);

  const isActive =
    item.href && (pathname === item.href || pathname.startsWith(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* LINK */}
      <div className="flex items-center gap-1 cursor-pointer">
        {item.href ? (
          <Link
            href={item.href}
            className="relative px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {item.label}

            {/* underline animado */}
            {isActive && (
              <motion.span
                layoutId="underline"
                className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded"
              />
            )}
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition">
            {item.label}
            <ChevronDown className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-3 w-56 rounded-xl border border-border bg-background shadow-xl p-3"
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
