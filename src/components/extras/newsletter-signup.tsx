"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success">("idle")

  const subscribe = async () => {
    if (!email.trim()) return
    await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setStatus("success")
    setEmail("")
  }

  return (
    <div className="space-y-2">
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail címed"
        type="email"
      />
      <Button onClick={subscribe}>Feliratkozás</Button>
      {status === "success" && (
        <p className="text-sm text-muted-foreground">Köszi a feliratkozást!</p>
      )}
    </div>
  )
}
