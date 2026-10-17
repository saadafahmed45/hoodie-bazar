import { getProducts, getCategories } from "@/lib/db";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";

  // Core static storefront routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/new-arrivals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sale`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic individual product routes
  let productRoutes = [];
  try {
    const products = await getProducts({}, { createdAt: -1 });
    if (Array.isArray(products)) {
      productRoutes = products
        .filter((p) => Boolean(p.slug))
        .map((product) => ({
          url: `${baseUrl}/product/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error("Error generating product sitemap:", error);
  }

  // Dynamic category filter routes
  let categoryRoutes = [];
  try {
    const categories = await getCategories();
    if (Array.isArray(categories)) {
      categoryRoutes = categories
        .filter((c) => Boolean(c.slug))
        .map((cat) => ({
          url: `${baseUrl}/shop?category=${encodeURIComponent(cat.slug)}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error("Error generating category sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
