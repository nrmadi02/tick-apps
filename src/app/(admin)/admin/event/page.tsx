import { Metadata } from "next";

import EventContainer from "~/features/admin/event/event.container";

export const metadata: Metadata = {
  title: "Admin - Event",
  description: "Ticketing Apps Admin Event",
};

export default function Page() {
  return <EventContainer />;
}
