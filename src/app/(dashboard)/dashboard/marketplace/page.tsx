import { PageHeader } from "@/components/page-header"
import { Alert } from "@heroui/react"
import { COMPONENTS } from "./components-catalog"
import { MarketplaceCard } from "@/components/marketplace-card"
import { getSessionFromCookie } from "@/utils/auth"
import { getUserPurchasedItems } from "@/utils/credits"

export default async function MarketplacePage() {
  const session = await getSessionFromCookie();
  const purchasedItems = session ? await getUserPurchasedItems(session.userId) : new Set();

  return (
    <>
      <PageHeader
        items={[
          {
            href: "/dashboard/marketplace",
            label: "Piactér"
          }
        ]}
      />
      <div className="container mx-auto px-5 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mt-4">Blog extrák piactér</h1>
          <p className="text-muted-foreground mt-2">
            Itt különböző könnyen beilleszthető blog funkciókat vásárolhatsz a pontjaidból.
          </p>
        </div>

        <Alert
          color="warning"
          title="Próba piactér"
          description="Ez az oldal bemutatja, hogyan tudsz pontokért kiegészítő funkcionalitást venni a blogodra."
          className="mb-6"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((component) => (
            <MarketplaceCard
              key={component.id}
              id={component.id}
              name={component.name}
              description={component.description}
              credits={component.credits}
              containerClass={component.containerClass}
              isPurchased={purchasedItems.has(`COMPONENT:${component.id}`)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
