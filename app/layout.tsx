import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fisica Interactiva Areandina",
    template: "%s | Fisica Interactiva",
  },
  description:
    "Plataforma academica de Areandina para explorar materias, simuladores, videos, documentos, libros y cartillas.",
  openGraph: {
    title: "Fisica Interactiva Areandina",
    description:
      "Recursos academicos, simuladores y biblioteca digital para estudiantes.",
    url: "https://fisicainteractiva.online",
    siteName: "Fisica Interactiva",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
