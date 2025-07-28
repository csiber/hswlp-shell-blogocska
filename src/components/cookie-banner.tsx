"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setVisible(consent !== "accepted");
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-2 bg-[#202225] p-4 shadow md:flex-row md:justify-between">
      <p className="text-sm text-white">
        A webhely sütiket használ a legjobb élmény érdekében. {""}
        <Link href="/privacy" className="underline">
          Részletek
        </Link>
      </p>
      <Button
        className="bg-[#3ea6ff] text-black hover:bg-[#60c9ff]"
        onClick={() => {
          localStorage.setItem("cookie-consent", "accepted");
          setVisible(false);
        }}
      >
        Elfogadom
      </Button>
    </div>
  );
}
