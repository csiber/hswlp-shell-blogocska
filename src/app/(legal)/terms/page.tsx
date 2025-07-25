import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CREDITS_EXPIRATION_YEARS } from "@/constants";

export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: "Ismerd meg a használati feltételeinket",
};

export default function TermsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-foreground mb-8">Felhasználási feltételek</h1>

      <p className="text-muted-foreground mb-6">Utoljára frissítve: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">1. A feltételek elfogadása</h2>
        <p className="text-muted-foreground">
          A Blogocska használatával elfogadod a jelen felhasználási feltételeket.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">2. A szolgáltatás használata</h2>
        <p className="text-muted-foreground">
          A szolgáltatást saját felelősségedre és nem kereskedelmi célra használhatod. A tartalmakat szerzői jog védi.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Felelősség kizárása</h2>
        <p className="text-muted-foreground">
          A Blogocska szolgáltatásait „ahogy van” alapon nyújtjuk, minden garancia nélkül.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Kredit rendszer és fizetés</h2>
        <p className="text-muted-foreground mb-4">
          A rendszer kreditek segítségével működik. A vásárolt kreditek {CREDITS_EXPIRATION_YEARS} évig érvényesek, visszatérítésre nincs lehetőség.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">5. Korlátozás</h2>
        <p className="text-muted-foreground">
          Nem vállalunk felelősséget semmilyen közvetett vagy következményes kárért, ami a szolgáltatás használatából ered.
        </p>
      </section>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/">Vissza a főoldalra</Link>
        </Button>
      </div>
    </>
  );
}
