import { Metadata } from "next";

import EditEventContainer from "~/features/admin/event/edit-event.container";

export const metadata: Metadata = {
  title: "Admin - Edit Event",
  description: "Ticketing Apps Admin Edit Event",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <EditEventContainer id={id} />;
}
