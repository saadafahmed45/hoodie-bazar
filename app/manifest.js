export default function manifest() {
  return {
    name: "Hoodie Bazar — Winter, Refined.",
    short_name: "Hoodie Bazar",
    description:
      "Architectural heavyweight hoodies, oversized crewnecks, jackets, and winter streetwear essentials crafted for Bangladesh.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/whatsapp-avatar.svg",
        sizes: "120x120",
        type: "image/svg+xml",
      },
    ],
  };
}
