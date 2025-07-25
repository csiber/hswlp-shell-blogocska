import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: "Tájékozódj adatkezelési gyakorlatunkról",
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-foreground mb-8">Adatkezelési tájékoztató</h1>

      <p className="text-muted-foreground mb-6">Utoljára frissítve: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">1. Milyen adatokat gyűjtünk?</h2>
        <p className="text-muted-foreground">
          Regisztrációkor megadott nevedet és e‑mail címedet, valamint az általad létrehozott bejegyzéseket tároljuk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">2. Az adatok felhasználása</h2>
        <p className="text-muted-foreground">
          Az adatokat a szolgáltatás működtetésére, értesítések küldésére és a fiókod biztonságának védelmére használjuk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Adatbiztonság</h2>
        <p className="text-muted-foreground">
          Adatbázisunk a Cloudflare infrastruktúráján található, ahol minden ésszerű intézkedést megteszünk a védelem érdekében.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">4. Kapcsolat</h2>
        <p className="text-muted-foreground">
          Kérdés esetén írj a <code>privacy@hswlp.hu</code> címre.
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
