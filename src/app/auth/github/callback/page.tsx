"use client";

import { useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useJWT } from "@/hooks/useJWT";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { setToken } = useJWT();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://210.178.236.36:3000/auth/github/callback?code=${code}`
      );
      const data = await response.json();
      const token = data.access_token;
      console.log(token);
      sessionStorage.setItem("token", token);
      setToken(token);
      redirect("http://localhost:3001");
    }
    if (code) {
      fetchData();
    }
  }, [code, setToken]);

  return <div className="self-center">Login Success, Redireting...</div>;
}
