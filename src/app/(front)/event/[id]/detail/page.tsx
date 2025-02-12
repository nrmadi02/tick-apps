import { Metadata } from "next";

import EventContainer from "~/features/front/event/event.container";

export const metadata: Metadata = {
  title: "Event - Detail",
  description: "Ticketing Event Detail",
};

export default function Page() {
  return <EventContainer />;
}
