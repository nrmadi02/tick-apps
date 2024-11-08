import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <p>sgdg</p>
    </HydrateClient>
  );
}
