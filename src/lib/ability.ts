import { AbilityBuilder, PureAbility } from "@casl/ability";
import { Session } from "next-auth";

type Actions = "manage" | "create" | "read" | "update" | "delete";
type Subjects = string | "all";

export type AppAbility = PureAbility<[Actions, Subjects]>;

export function defineAbilityFor(
  user?: Session["user"]
  | null
): AppAbility {
  const { can, rules } = new AbilityBuilder<PureAbility<[Actions, Subjects]>>(
    PureAbility,
  );

  if (user) {
    user.permissions.forEach((permission) => {
      can(permission.action as Actions, permission.subject.name);
    })
  }

  return new PureAbility<[Actions, Subjects]>(rules);
}
