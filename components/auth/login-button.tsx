"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface LoginButtonProps {
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  if (mode == "modal") {
    return <span>TODO: implement modal</span>;
  }

  return (
    <Button
      onClick={() => router.push("/auth/login")}
      variant="secondary"
      size="lg"
    >
      Sign in
    </Button>
  );
};
