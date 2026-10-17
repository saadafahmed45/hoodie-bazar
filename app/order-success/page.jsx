import OrderSuccessClient from "./OrderSuccessClient";

export const metadata = {
  title: "Order Placed Successfully",
  description:
    "Thank you for shopping with Hoodie Bazar. Your winter streetwear order has been confirmed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderSuccessPage(props) {
  const searchParams = await props.searchParams;
  const orderId = searchParams?.id || "";
  const customerName = searchParams?.name || "Valued Customer";
  const totalAmount = searchParams?.total ? Number(searchParams.total) : null;
  const paymentMethod = searchParams?.payment || "CASH_ON_DELIVERY";
  const district = searchParams?.district || "Dhaka";

  return (
    <OrderSuccessClient
      orderId={orderId}
      customerName={customerName}
      totalAmount={totalAmount}
      paymentMethod={paymentMethod}
      district={district}
    />
  );
}
