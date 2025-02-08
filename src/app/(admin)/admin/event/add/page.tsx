import { Metadata } from "next";

import AddEventContainer from "~/features/admin/event/add-event.container";

export const metadata: Metadata = {
  title: "Admin - Add Event",
  description: "Ticketing Apps Admin Add Event",
};

export default function Page() {
  return <AddEventContainer />;
}
