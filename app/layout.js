import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppWidget from "@/components/layout/FloatingWhatsAppWidget";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hoodiebazar.com";

export const viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hoodie Bazar | Premium Heavyweight Hoodies & Winter Streetwear",
    template: "%s | Hoodie Bazar",
  },
  description:
    "Discover architectural heavyweight hoodies, oversized sweatshirts, jackets, and modern winter streetwear essentials from Hoodie Bazar. Crafted for Bangladesh with nationwide Cash on Delivery.",
  keywords: [
    "hoodie bazar",
    "hoodies bd",
    "winter collection bangladesh",
    "heavyweight hoodies",
    "streetwear dhaka",
    "oversized hoodie",
    "sweatshirts bd",
    "winter jackets bd",
    "mens winter wear",
    "nivora",
  ],
  authors: [{ name: "Hoodie Bazar", url: siteUrl }],
  creator: "Hoodie Bazar",
  publisher: "Hoodie Bazar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hoodie Bazar — Winter, Refined.",
    description:
      "Architectural heavyweight hoodies and modern streetwear crafted for Bangladesh. Fast delivery & 7-day return guarantee.",
    url: "/",
    siteName: "Hoodie Bazar",
    locale: "en_BD",
    type: "website",
    images: [
      {
        url: "/images/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Hoodie Bazar — Winter Streetwear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hoodie Bazar — Winter, Refined.",
    description:
      "Premium winter wear and heavyweight streetwear in Bangladesh.",
    images: ["/images/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111111]">
        <AuthProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsAppWidget />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

