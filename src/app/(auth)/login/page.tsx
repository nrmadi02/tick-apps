import { Metadata } from "next";

import LoginContainer from "~/features/auth/login/login.container";

export const metadata: Metadata = {
  title: "Tick Apps | Login",
  description: "Ticketing Apps Login",
};

export default function Login() {
  return <LoginContainer />;
}
