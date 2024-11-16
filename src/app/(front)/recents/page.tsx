import { Metadata } from "next";

import RecentsContainer from "~/features/front/recents/recents.container";

export const metadata: Metadata = {
  title: "Tick Apps - Recents",
  description: "Ticketing Apps",
};

export default function Recents() {
  return <RecentsContainer />;
}
