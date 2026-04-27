import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Inicio", href: "/" },
  { label: "Simuladores", href: "/simuladores" },
  { label: "Videos", href: "/videos" },
  { label: "Documentos", href: "/documentos" },
  { label: "Autores", href: "/autores" },
  { label: "Admin", href: "/admin" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-black text-white">
      <div className="section-shell grid gap-10 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <div className="inline-flex rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <Image
              src="/brand/areandina-logo.png"
              alt="Areandina"
              width={300}
              height={82}
              className="h-auto w-[200px] md:w-[280px]"
              priority
            />
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">
            FisicaLab adapta la experiencia academica de la Fundacion Universitaria del Area Andina
            para ofrecer simulaciones, videos, documentos y materiales de apoyo en una sola plataforma.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7fb536]">
              Navegacion
            </p>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f5982f]">
              Identidad
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <p>Verde Areandina como color principal.</p>
              <p>Naranja y fucsia como acentos editoriales.</p>
              <p>Base oscura institucional para cierre visual del sitio.</p>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
