import { Metadata } from "next";

import EventCheckoutContainer from "~/features/front/event/event-checkout.container";

export const metadata: Metadata = {
  title: "Event - Checkout",
  description: "Ticketing Event Checkout",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  console.log(id);
  return <EventCheckoutContainer />;
}
