export const metadata = {
  title: "Track Your Order Live",
  description:
    "Track the live processing and delivery progress of your Hoodie Bazar garment using your Order ID or phone number.",
  alternates: {
    canonical: "/track-order",
  },
  openGraph: {
    title: "Track Order | Hoodie Bazar",
    description: "Live order tracking for Hoodie Bazar customers.",
    url: "/track-order",
    type: "website",
  },
};

export default function TrackOrderLayout({ children }) {
  return children;
}
