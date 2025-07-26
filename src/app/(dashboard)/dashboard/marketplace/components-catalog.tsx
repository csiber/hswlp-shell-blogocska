import CommentsSection from "@/components/extras/comments-section"
import NewsletterSignup from "@/components/extras/newsletter-signup"
import LikeButton from "@/components/extras/like-button"

interface MarketplaceComponent {
  id: string
  name: string
  description: string
  credits: number
  containerClass?: string
  preview: () => React.ReactNode
}

export const COMPONENTS: MarketplaceComponent[] = [
  {
    id: "comments-section",
    name: "Hozzászólások szekció",
    description: "Egyszerű hozzászólási lehetőség a bejegyzések alatt.",
    credits: 5,
    containerClass: "w-full",
    preview: () => <CommentsSection />,
  },
  {
    id: "newsletter-signup",
    name: "Hírlevél feliratkozó űrlap",
    description: "Feliratkozási lehetőség a hírleveledre.",
    credits: 3,
    preview: () => <NewsletterSignup />,
  },
  {
    id: "like-button",
    name: "Tetszik gomb",
    description: "Egyszerű gomb a bejegyzések kedveléséhez.",
    credits: 2,
    preview: () => <LikeButton />,
  },
]
