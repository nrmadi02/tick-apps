import { Metadata } from "next";

import HomeContainer from "~/features/front/home/home.container";

export const metadata: Metadata = {
  title: "Tick Apps",
  description: "Ticketing Apps",
};

export default function Home() {
  return <HomeContainer />;
}
