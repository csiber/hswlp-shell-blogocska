'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ChevronLeft, X } from 'lucide-react'

const STORAGE_KEY = 'agenticdev-studio-banner-collapsed'

export function AgenticDevStudioStickyBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [screenshotKey, setScreenshotKey] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setIsCollapsed(JSON.parse(stored))
    }
    setIsHydrated(true)
  }, [])

  const toggleCollapsed = (value: boolean) => {
    setIsCollapsed(value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await fetch('/api/bug-report/image/upload', {
      method: 'POST',
      body: file,
    })
    const json = await res.json()
    if (res.ok && json.key) {
      setScreenshotKey(json.key)
      toast.success('Kép feltöltve')
    } else {
      toast.error(json.error || 'Hiba a kép feltöltésekor')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/bug-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, description, screenshotKey }),
    })
    const json = await res.json()
    setSubmitting(false)
    if (res.ok) {
      toast.success('Hibajelentés elküldve')
      setOpen(false)
      setName('')
      setEmail('')
      setDescription('')
      setScreenshotKey(null)
    } else {
      toast.error(json.error || 'Hiba a küldéskor')
    }
  }

  if (!isHydrated) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 z-[100] print:hidden',
        isCollapsed && 'pointer-events-none'
      )}
    >
      <div
        className={cn(
          'transition-all duration-300 ease-in-out transform',
          isCollapsed ? 'translate-x-[calc(100%+1rem)] md:translate-x-[calc(100%+1rem)]' : 'translate-x-0'
        )}
      >
        <div className='relative flex items-center w-[90vw] md:max-w-[400px]'>
          <Button
            variant='outline'
            size='icon'
            className={cn(
              'absolute left-0 h-8 w-8 rounded-full shadow-lg -translate-x-full',
              'bg-background hover:bg-background',
              'border-2 hover:border-border',
              isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0'
            )}
            onClick={() => toggleCollapsed(false)}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <div className='bg-gray-100 dark:bg-background rounded-lg shadow-xl border-2 relative'>
            <Button
              size='icon'
              className='h-6 w-6 absolute -top-3 -right-3 rounded-full shadow-md border border-border'
              onClick={() => toggleCollapsed(true)}
            >
              <X className='h-4 w-4' />
            </Button>
            <div className='flex items-center flex-col py-3 px-3'>
              <p className='text-sm text-center'>Találtál hibát az oldalon?</p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size='sm' className='mt-2'>Hibajelentés</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hibajelentés küldése</DialogTitle>
                    <DialogDescription>
                      Írd le röviden a hibát. Ha lehet, csatolj képernyőképet.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={onSubmit} className='space-y-4'>
                    <Input placeholder='Neved (opcionális)' value={name} onChange={e => setName(e.target.value)} />
                    <Input type='email' placeholder='Email (opcionális)' value={email} onChange={e => setEmail(e.target.value)} />
                    <Textarea
                      required
                      placeholder='Hiba részletes leírása'
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                    <input
                      type='file'
                      accept='image/*'
                      ref={fileInputRef}
                      className='hidden'
                      onChange={handleUpload}
                    />
                    <div className='flex items-center gap-2'>
                      <Button type='button' variant='outline' onClick={() => fileInputRef.current?.click()}>
                        Kép feltöltése
                      </Button>
                      {screenshotKey && <span className='text-xs text-muted-foreground'>Kép csatolva</span>}
                    </div>
                    <DialogFooter className='mt-2'>
                      <DialogClose asChild>
                        <Button type='button' variant='outline'>Mégse</Button>
                      </DialogClose>
                      <Button type='submit' disabled={submitting}>Küldés</Button>
                    </DialogFooter>
                  </form>
                  <p className='text-xs text-muted-foreground mt-4'>
                    Útmutató: írd le hogyan jelentkezett a hiba és mit vártál. A kép feltöltése segít a gyorsabb megoldásban.
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
