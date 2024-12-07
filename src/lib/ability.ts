import { AbilityBuilder, PureAbility } from "@casl/ability";
import { Session } from "next-auth";

import { db } from "~/server/db";

type Actions = "manage" | "create" | "read" | "update" | "delete";
type Subjects = string | "all";

export type AppAbility = PureAbility<[Actions, Subjects]>;

export async function defineAbilityFor(
  user?: Session["user"]
  | null
): Promise<AppAbility> {
  const { can, rules } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(
    PureAbility,
  );

  const roleWithPermissions = await db.role.findUnique({
    where: {
      id: user?.role.id,
    },
    include: {
      permissions: {
        include: {
          subject: true,
        },
      },
    },
  })

  if (roleWithPermissions) {
    roleWithPermissions.permissions.forEach((permission) => {
      can(permission.action as Actions, permission.subject.name);
    })
  }

  return new PureAbility<[Actions, Subjects]>(rules);
}
