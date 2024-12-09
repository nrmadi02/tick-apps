import { useSession } from "next-auth/react";

import { defineAbilityFor } from "~/lib/ability";

export const useAbility = () => {
  const { data: session } = useSession();

  return defineAbilityFor(session?.user);
};
