"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LikeButton() {
  const [count, setCount] = useState(0)

  return (
    <Button onClick={() => setCount((c) => c + 1)}>
      👍 Tetszik {count > 0 && <span className="ml-2">{count}</span>}
    </Button>
  )
}
