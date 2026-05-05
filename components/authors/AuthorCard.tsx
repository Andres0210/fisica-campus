"use client";

type Props = {
  item: {
    id?: string;
    name: string;
    role?: string;
    profession?: string;
    bio: string;
    image?: string;
    avatarUrl?: string | null;
  };
};

export default function AuthorCard({ item }: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-background transition hover:shadow-xl">
      
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img
          src={item.image || item.avatarUrl || "/authors/default.png"}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* NAME + ROLE sobre imagen */}
        <div className="absolute bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold leading-tight">
            {item.name}
          </h3>

          <p className="text-xs opacity-80 capitalize">
            {item.role || item.profession}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* BIO (ahora protagonista) */}
        <p className="text-sm text-muted-foreground leading-6 line-clamp-4">
          {item.bio}
        </p>
      </div>
    </div>
  );
}
