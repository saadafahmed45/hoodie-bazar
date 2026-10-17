export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/checkout",
          "/account",
          "/dashboard",
          "/order-status",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/*", "/_next/image*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
