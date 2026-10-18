export const metadata = {
  title: "Contact Client Concierge & Support | Hoodie Bazar",
  description:
    "Get in touch with Hoodie Bazar customer concierge for personalized sizing advice, order tracking, returns, and atelier visits in Banani, Dhaka. WhatsApp chat & phone support available daily.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Client Concierge & Atelier | Hoodie Bazar",
    description:
      "Reach our customer concierge via WhatsApp, phone (+880 1700-000000), or secure inquiry dispatch. Instant assistance with sizing, orders, and returns.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Hoodie Bazar Client Concierge",
    description:
      "Customer support, sizing guidance, order tracking, and atelier visits for Hoodie Bazar in Dhaka, Bangladesh.",
    url: "https://hoodiebazar.com/contact",
    mainEntity: {
      "@type": "ClothingStore",
      name: "Hoodie Bazar",
      telephone: "+8801700000000",
      email: "concierge@hoodiebazar.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Road 11, Block D, Banani",
        addressLocality: "Dhaka",
        postalCode: "1213",
        addressCountry: "BD",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+8801700000000",
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["English", "Bengali"],
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
