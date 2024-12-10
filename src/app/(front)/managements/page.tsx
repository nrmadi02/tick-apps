import { Metadata } from "next";

import ManagementsContainer from "~/features/front/managements/managements.container";

export const metadata: Metadata = {
  title: "Tick Apps - Managements",
  description: "Ticketing Apps",
};

export default function Managements() {
  return <ManagementsContainer />;
}
