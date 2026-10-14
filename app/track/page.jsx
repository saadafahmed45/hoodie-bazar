import { redirect } from "next/navigation";

export default async function TrackPage(props) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams(searchParams);
  const target = params.toString() ? `/track-order?${params.toString()}` : "/track-order";
  redirect(target);
}
