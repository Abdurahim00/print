import { redirect } from "next/navigation"

interface PageProps {
  params: {
    locale: string
    productId: string
  }
}

export default function DesignToolProductPage({ params }: PageProps) {
  // Redirect to step 1 of the design tool
  redirect(`/${params.locale}/design-tool/${params.productId}/step/1`)
}