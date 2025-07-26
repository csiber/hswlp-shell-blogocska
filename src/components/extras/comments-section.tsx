"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CommentsSection() {
  const [comments, setComments] = useState<string[]>([])
  const [text, setText] = useState("")

  const addComment = () => {
    if (!text.trim()) return
    setComments([...comments, text.trim()])
    setText("")
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Hozzászólások</h3>
      <div className="space-y-2 mb-4">
        {comments.map((c, i) => (
          <div key={i} className="p-2 border rounded">
            {c}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground">Nincsenek hozzászólások.</p>
        )}
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Írd ide a hozzászólásod..."
        className="mb-2"
      />
      <Button onClick={addComment}>Küldés</Button>
    </div>
  )
}
