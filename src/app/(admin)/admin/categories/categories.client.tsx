"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateSlug } from "@/utils/slugify";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

interface Props {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(generateSlug(name));
    }
  }, [name, slugEdited]);

  function startCreate() {
    setEditing(null);
    setName("");
    setSlug("");
    setSlugEdited(false);
    setOpen(true);
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSlugEdited(true);
    setOpen(true);
  }

  async function handleSave() {
    const payload = { name, slug };
    const res = await fetch(editing ? `/api/blog/categories/${editing.id}` : "/api/blog/categories/new", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      if (editing) {
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name, slug } : c)));
        toast.success("Kategória frissítve");
      } else {
        setCategories((prev) => [...prev, data]);
        toast.success("Kategória létrehozva");
      }
      setOpen(false);
    } else {
      toast.error(data.error || "Hiba történt");
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm("Biztosan törlöd?")) return;
    const res = await fetch(`/api/blog/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success("Kategória törölve");
    } else {
      toast.error(data.error || "Hiba történt");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategóriák</h1>
        <Button onClick={startCreate}>Új kategória</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Név</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="capitalize">{cat.name}</TableCell>
              <TableCell>
                <span className="font-mono text-sm">{cat.slug}</span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(cat)}>
                  Szerkesztés
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(cat)}>
                  Törlés
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Nincs kategória.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Kategória szerkesztése" : "Új kategória"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Név" />
            <Input
              className="font-mono"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="Slug"
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Mégse</Button>
            </DialogClose>
            <Button onClick={handleSave}>Mentés</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

