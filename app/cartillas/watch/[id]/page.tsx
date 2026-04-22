import { notFound } from "next/navigation";
import { getResourceById } from "@/lib/academic-content";
import Navbar from "@/components/Navbar";

export default function Page({ params }: { params: { id: string } }) {
  const item = getResourceById("cartillas", params.id);

  if (!item) return notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HEADER */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-6">
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {item.subject}
        </p>
      </section>

      {/* PDF VIEWER */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-2xl overflow-hidden border border-border/60 h-[80vh]">
          <iframe
            src={item.pdf || item.file || item.url}
            className="w-full h-full"
          />
        </div>
      </section>
    </main>
  );
}