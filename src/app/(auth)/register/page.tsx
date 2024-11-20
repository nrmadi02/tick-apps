import { Metadata } from "next";

import RegisterContainer from "~/features/auth/register/register.container";

export const metadata: Metadata = {
  title: "Tick Apps | Register",
  description: "Ticketing Apps Register",
};

export default function Register() {
  return <RegisterContainer />;
}
