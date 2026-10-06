import Image from "next/image";
import { InstagramIcon } from "@/components/icons/SocialIcons";

export default function InstagramGallery() {
  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80",
      handle: "@nivora.wear",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-nivora-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block mb-2">
          JOIN THE COMMUNITY
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
          FOLLOW US ON INSTAGRAM
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold uppercase tracking-widest text-[#111111] hover:text-nivora-muted transition-colors mt-1 inline-block"
        >
          @nivora.wear
        </a>
      </div>

      {/* 6 square images grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.map((post) => (
          <a
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-nivora-dark block"
          >
            <Image
              src={post.image}
              alt="NIVORA on Instagram"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            {/* Hover overlay with Instagram icon */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <InstagramIcon className="h-6 w-6 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
