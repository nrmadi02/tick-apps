import { Metadata } from "next";

import RolesContainer from "~/features/front/roles/roles.container";

export const metadata: Metadata = {
  title: "Tick Apps - Roles",
  description: "Ticketing Apps",
};

export default function Recents() {
  return <RolesContainer />;
}
