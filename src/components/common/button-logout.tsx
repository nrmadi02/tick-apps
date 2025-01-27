"use client";

import { signOut } from "next-auth/react";

import { Button } from "../ui/button";

export default function ButtonLogout() {
  return <Button onClick={() => signOut()}>Logout</Button>;
}
